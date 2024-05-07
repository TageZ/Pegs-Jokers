package com.example.pegsandjokers.api.controller.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@JsonSerialize(using = GameSerializer.class)
public class Game {

    private static final int NUM_PLAYERS = 4;
    private static final int SIZE_OF_HEAVEN = 5;
    private String roomName;
    private Board board;
    private Player[] players;
    private Hand[] hands;
    private Deck deck;
    private int playerTurn;

    public Game(String roomName){
        this.roomName = roomName;
        this.deck = new Deck();
        initializePlayers();
        this.board = new Board(this.players);
        initializeHands();
        this.playerTurn = 0;
    }

    public void initializePlayers() {
        this.players = new Player[NUM_PLAYERS];
        for (int i = 0; i < NUM_PLAYERS; i++) {
            String color = getPlayerColor(i);
            this.players[i] = new Player(i, color, this.deck);
            ArrayList<Peg> pegs = new ArrayList<>();
            for (int j = 0; j < 5; j++) {
                Peg p = new Peg(color, j, this.players[i]);
                pegs.add(p);
            }
            this.players[i].setPegs(pegs);
        }

        for (int i = 0; i < NUM_PLAYERS; i++) {
            if (i < NUM_PLAYERS / 2) {
                this.players[i].setPartner(this.players[i + NUM_PLAYERS / 2]);
            } else {
                this.players[i].setPartner(this.players[i - NUM_PLAYERS / 2]);
            }
        }
    }

    public void initializeHands(){
        this.hands = new Hand[this.players.length];
        for (int i = 0; i < this.hands.length; i++){
            this.hands[i] = this.players[i].getHand();
        }
    }

    public String getPlayerColor(int num){
        return switch (num) {
            case 0 -> "red";
            case 1 -> "fuchsia";
            case 2 -> "green";
            case 3 -> "blue";
            default -> null;
        };
    }

    /**
     * Calls processMove() and either makes a peg move if the move was valid or does nothing.
     * @param peg - The peg that is to be moved.
     * @param spaces - The amount of spaces to move the peg.
     * @param forward - Whether the peg is moving forward or backward.
     * @return - Whether the move was successful.
     */
    public boolean movePeg(Peg peg, int spaces, boolean forward) {
        Hole h = processMove(peg, spaces, forward);
        if (h != null){
            this.addPegToHole(peg, h);
            return true;
        }
        return false;
    }

    /**
     * Validates that a move can be made. If the move is valid, returns the hole that the peg is desiring to move to.
     * If the move is invalid, returns null.
     *
     * @param peg - The peg that is to be moved.
     * @param spaces - The amount of spaces to move the peg.
     * @param forward - Whether the peg is moving forward or backward.
     * @return - The hole the peg is wanting to move to if valid, otherwise null.
     */
    public Hole processMove(Peg peg, int spaces, boolean forward) {
        if (peg.getInHeaven()){
            //TODO ADD index out of bounds catch of some kind
            return moveInHeaven(peg, spaces);
        }
        Hole[] loop = this.board.getLoop();
        Hole current = peg.getHole();
        int index = this.board.getHoleIndex(current);
        Player p = peg.getPlayer();
        int count = 0;

        while (count < spaces) {
            if (current.equals(peg.getPlayer().getHeavensGate()) && (spaces-count) <= SIZE_OF_HEAVEN && forward) {
                return processHeaven(peg, spaces-count);
            }

            if (forward) {
                index = (index + 1) % loop.length;
            } else {
                index = (index == 0) ? (loop.length - 1) : (index - 1);
            }
            current = loop[index];
            count++;

            Peg obstacle = current.getPeg();
            if (obstacle != null && obstacle.getPlayer().equals(p)) {
                return null;
            }
        }

        Hole h = current;
        if (this.testAddPegToHole(peg, h)){
            return h;
        }
        return null;
    }

    public Hole processHeaven(Peg peg, int spaces){
        Integer playerID = peg.getPlayer().getId();
        Hole current = peg.getPlayer().getHeavensGate();
        Hole[] heaven = this.board.getHeavens()[playerID];
        current = heaven[this.board.getHeavenIndex(playerID, current.getFork())];
        int count = 1;
        while (count < spaces){
            current = heaven[count];

            Peg obstacle = current.getPeg();
            if (obstacle != null) {
                return null;
            }

            count++;
        }

        Hole h = current;
        if (this.testAddPegToHole(peg, h)){
            peg.setInHeaven(true);
            return h;
        }
        return null;
    }

    public Hole moveInHeaven(Peg peg, int spaces){
        Integer playerID = peg.getPlayer().getId();
        Hole[] heaven = this.board.getHeavens()[playerID];
        int index = this.board.getHeavenIndex(playerID, peg.getHole().getId());
        Hole current = heaven[index];
        int count = index;

        while (count < index + spaces){
            count++;
            current = heaven[count];

            Peg obstacle = current.getPeg();
            if (obstacle != null) {
                return null;
            }
        }

        Hole h = current;
        if (this.testAddPegToHole(peg, h)){
            peg.setInHeaven(true);
            return h;
        }
        return null;
    }

    public boolean move(Peg peg, Card card){
        Value value = card.getValue();
        switch (value) {
            case ACE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, NINE, TEN, JACK, QUEEN, KING -> {
                return movePeg(peg, value.ordinal() + 1, true);
            }
            case EIGHT -> {
                return movePeg(peg, value.ordinal() + 1, false);
            }
            default -> {
                return false;
            }
        }
    }

    /**
     * Handles a split move where two pegs are moved, with the sum of the spaces moved equal to the sum
     * of the card's value.
     *
     * @param peg1 - The first peg to be moved
     * @param peg2 - The second peg to be moved
     * @param card - The card that is being played for a split (Which is a 7 or a 9)
     * @param spaces - How many spaces the first peg should be moved.
     * @param forward - Whether the first peg should move forward or backward.
     * @return - Whether the move was successful.
     */
    public boolean splitMove(Peg peg1, Peg peg2, Card card, int spaces, boolean forward) {
        //Get value of the card (either a SEVEN or a NINE).
        Value value = card.getValue();

        //Move the first peg forward the provided spaces.
        Hole h1 = processMove(peg1, spaces, forward);
        Hole h2;

        //If first move is successful
        if (h1 != null) {
            //If the first move took the peg onto the other peg
            if (h1.equals(peg2.getHole())) {
                //Get the original hole for if a reversion is needed
                Hole og1 = peg1.getHole();
                //Add the peg to the hole
                this.addPegToHole(peg1, h1);

                //Determine h2
                if (value.equals(Value.SEVEN)) {
                    h2 = processMove(peg2, value.ordinal() + 1 - spaces, true);
                } else {
                    h2 = processMove(peg2, value.ordinal() + 1 - spaces, !forward);
                }

                if (h2 != null) {
                    //If h2 isn't null, success.
                    //Move the second peg
                    this.addPegToHole(peg2, h2);
                    return true;
                } else {
                    //Otherwise, revert original move.
                    this.addPegToHole(peg1, og1);
                    this.addPegToHole(peg2, h1);
                    return false;
                }
            } else {
                //Move wasn't on other peg.

                //Determine h2.
                if (value.equals(Value.SEVEN)) {
                    h2 = processMove(peg2, value.ordinal() + 1 - spaces, true);
                } else {
                    h2 = processMove(peg2, value.ordinal() + 1 - spaces, !forward);
                }

                //Check if the both pegs can be moved as desired.
                if (h2 != null) {
                    //Success
                    this.addPegToHole(peg1, h1);
                    this.addPegToHole(peg2, h2);
                    return true;
                }
                return false;
            }
        }
        return false;
    }

    /**
     * Determines if there is a winner in the game by checking if any pair of partner players has all their
     * pieces in their respective heavens.
     *
     * @return - Whether there is a winner.
     */
    public boolean isWinner(){
        //Loop through the first half of the players
        for (int i = 0; i < this.players.length / 2; i++){
            boolean winner = true;
            Player p = this.players[i];
            //Loop through each of the player's pegs.
            for (Peg peg : p.getPegs()){
                //If any peg isn't in heaven, set winner to false.
                if (!peg.getInHeaven()) {
                    winner = false;
                    break;
                }
            }

            //Loop through each of the player's partner's pegs.
            for (Peg peg: p.getPartner().getPegs()){
                //If any peg isn't in heaven, set winner to false.
                if (!peg.getInHeaven()) {
                    winner = false;
                    break;
                }
            }

            //If winner is still true, there is a winner.
            if (winner){
                return true;
            }
        }
        //There is no winner.
        return false;
    }

    /**
     * Handles swapping of two pieces on the board.
     * Updates the peg attributes of both holes to be the other peg.
     * Updates the hole attributes of both pegs to be the other hole.
     *
     * @param peg1 - one peg to be swapped.
     * @param peg2 - the other peg to be swapped.
     */
    public boolean swap(Peg peg1, Peg peg2){
        if (peg1.getColor().equals(peg2.getColor()) || peg1.getInHome() || peg2.getInHome()){
            return false;
        }
        //Get the two holes
        Hole a = peg1.getHole();
        Hole b = peg2.getHole();

        //Assign the pegs to their new holes.
        a.setPeg(peg2);
        b.setPeg(peg1);

        //Assign the holes to their new pegs.
        peg1.setHole(b);
        peg2.setHole(a);
        return true;
    }

    /**
     * Handles when one piece moves onto the hole that is being occupied by another piece, known as a "kill" in the game.
     * If the two pegs are partners, the peg that is moved onto will be sent to that player's "heaven's gate".
     * If the two pegs aren't friendly, the peg that is moved onto will be sent to that player's "home".
     *
     * @param a - the peg that is moving onto the occupied hole.
     * @param b - the peg this is occupying the hole.
     * @return - Whether the move was successful.
     */
    public boolean kill(Peg a, Peg b){
        //Get the hole peg b is occupying.
        Hole hole = b.getHole();
        //If the pegs are two partner pieces.
        if (a.getPlayer().getPartner().equals(b.getPlayer())){
            //Call sendToHeavensGate on b first, if that is successful, call addPegToHole on peg a and the hole.
            return sendToHeavensGate(b) && addPegToHole(a, hole);
        } else {
            //If the pegs aren't partner pieces, remove the peg from the hole.
            hole.removePeg();
            //Send the peg to its home.
            b.sendHome();
            this.addPegToHole(b, this.board.getHomes()[b.getPlayer().getId()][b.getNum()]);
            //call addPegToHole on peg a and the hole.
            return this.addPegToHole(a, hole);
        }
    }

    /**
     * Handles sending a piece to the player's "heaven's gate".
     *
     * @param p - the peg that is being moved.
     * @return - Whether the move was successful.
     */
    public boolean sendToHeavensGate(Peg p){
        //Get the player and their heaven's gate.
        Player player = p.getPlayer();
        Hole heavensGate = player.getHeavensGate();
        //Call the addPegToHole function on the peg and hole.
        return addPegToHole(p, heavensGate);
    }

    /**
     * Handles adding a peg to a specified hole.
     * If the hole is unoccupied, the peg is removed from its previous hole and added to the hole.
     * If the hole is occupied by a peg of the same color, the move is unsuccessful.
     * If the hole is occupied by a peg that isn't of the same color, calls the kill function.
     *
     * @param p - The peg that is being added to the hole.
     * @param h - The hole the peg is being added to.
     * @return - Whether the move was successful.
     */
    public boolean addPegToHole(Peg p, Hole h){
        Player player = p.getPlayer();

        //If the hole is empty, do the following:
        if (h.getPeg() == null){
            //Remove the peg from previous hole
            if (p.getHole() != null){
                p.getHole().removePeg();
            }
            //Add the peg to the hole
            h.setPeg(p);
            //Assign the new hole to the peg.
            p.setHole(h);
            //Successful turn
            return true;
        } else if (h.getPeg().getPlayer().equals(player)){
            //If the hole has a peg of the same color, unsuccessful turn
            return false;
        } else {
            //If the hole is occupied by a different color, call kill function.
            return kill(p, h.getPeg());
        }
    }

    /**
     * A test version of addPegToHole() for moves that have concurrent moving pieces, all of which need to be checked
     * before any attributes are updated.
     * If the hole is unoccupied, the peg is removed from its previous hole and added to the hole.
     * If the hole is occupied by a peg of the same color, the move is unsuccessful.
     * If the hole is occupied by a peg that isn't of the same color, calls the kill function.
     *
     * @param p - The peg that is being added to the hole.
     * @param h - The hole the peg is being added to.
     * @return - Whether the move was successful.
     */
    public boolean testAddPegToHole(Peg p, Hole h){
        Player player = p.getPlayer();

        //If the hole is empty, do the following:
        if (h.getPeg() == null){
            //Successful turn
            return true;
        } else if (h.getPeg().getPlayer().equals(player)){
            //If the hole has a peg of the same color, unsuccessful turn
            return false;
        } else {
            //If the hole is occupied by a different color, call kill function.
            return testKill(p, h.getPeg());
        }
    }

    /**
     * A test version of kill() for moves that have concurrent moving pieces, all of which need to be checked
     * before any attributes are updated.
     * If the two pegs are partners, the peg that is moved onto will be sent to that player's "heaven's gate".
     * If the two pegs aren't friendly, the peg that is moved onto will be sent to that player's "home".
     *
     * @param a - the peg that is moving onto the occupied hole.
     * @param b - the peg this is occupying the hole.
     * @return - Whether the move was successful.
     */
    public boolean testKill(Peg a, Peg b){
        //Get the hole peg b is occupying.
        Hole hole = b.getHole();
        //If the pegs are two partner pieces.
        if (a.getPlayer().getPartner().equals(b.getPlayer())){
            //Call sendToHeavensGate on b first, if that is successful, the peg can be added;
            return testSendToHeavensGate(b);
        } else {
            //Sending an opponent to their home will always succeed.
            return true;
        }
    }

    /**
     * A test version of sendToHeavensGate() for moves that have concurrent moving pieces, all of which need to be checked
     * before any attributes are updated.
     *
     * @param p - the peg that is being moved.
     * @return - Whether the move was successful.
     */
    public boolean testSendToHeavensGate(Peg p){
        //Get the player and their heaven's gate.
        Player player = p.getPlayer();
        Hole heavensGate = player.getHeavensGate();
        //Call the addPegToHole function on the peg and hole.
        return testAddPegToHole(p, heavensGate);
    }



    /**
     * Handles removing a peg from the player's home.
     *
     * @param p - the peg to get out of home.
     * @return - Whether the move was successful.
     */
    public boolean getOut(Peg p){
        //Get the player and their homeStep
        Player player = p.getPlayer();
        Hole homeStep = player.getHomeStep();
        //Call the addPegToHole function on the piece and the hole.
        if (addPegToHole(p, homeStep)){
            //If successful, remove peg from home, return true.
            p.removeFromHome();
            return true;
        }
        //If unsuccessful, return false.
        return false;
    }

    public Card getRandomCard(){
        if (this.deck.getCards().isEmpty()){
            this.deck.initializeDeck();
            this.deck.shuffle();
        }

        return this.deck.getCards().remove(0);
    }

    public Deck getDeck(){
        return this.deck;
    }

    public String getRoomName(){
        return this.roomName;
    }

    public Board getBoard(){
        return this.board;
    }

    public Player[] getPlayers() {
        return this.players;
    }

    //For testing
    public void setPegOnHole(Peg p, Hole h){
        p.setHole(h);
        h.setPeg(p);
    }

    @Override
    public boolean equals(Object o){
        if (!(o instanceof Game g)) return false;
        return this.roomName.equals(g.getRoomName());
    }

    public int getPlayerTurn() {
        return playerTurn;
    }

    public void updatePlayerTurn() {
        this.playerTurn++;
        this.playerTurn %= NUM_PLAYERS;
    }

    public Hand[] getHands(){
        return this.hands;
    }
}
