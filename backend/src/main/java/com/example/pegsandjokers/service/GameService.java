package com.example.pegsandjokers.service;

import com.example.pegsandjokers.api.controller.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GameService {

    private List<Game> gameList;

    public GameService(){
        this.gameList = new ArrayList<>();
    }
    public Optional<Game> getGame(String roomName) {
        Optional<Game> optional = Optional.empty();
        for (Game game : this.gameList){
            if (roomName.equals(game.getRoomName())){
                optional = Optional.of(game);
                return optional;
            }
        }
        return optional;
    }

    public boolean takeTurn(Turn turn) {
        Game g = getGameByRoomName(turn.getRoomName());
        Player player = g.getPlayers()[g.getPlayerTurn()];
        if (turn.getP() == null){
            return true;
        }
        Peg p = getPeg(turn.getP(), player);
        Peg p2 = turn.getP2();
        Card c = turn.getCard();
        int spaces = turn.getSpaces();
        boolean forward = turn.isForward();

        if (p == null){
            return false;
        } else if (p.getInHome() && !c.getValue().equals(Value.JOKER)) {
            if (!(c.getValue().equals(Value.ACE) || c.getValue().equals(Value.JACK) || c.getValue().equals(Value.KING) || c.getValue().equals(Value.QUEEN))){
                return false;
            }
            return g.getOut(p);
        } else if (p2 != null){
            Player player2 = g.getPlayers()[getNumPlayerFromColor(p2.getColor())];
            p2 = getPeg(turn.getP2(), player2);
            if (c.getValue().equals(Value.TWO)) {
                return g.swap(p, p2);
            } else if (c.getValue().equals(Value.JOKER)) {
                if (p2.getInHome()){
                    return false;
                }

                p.removeFromHome();
                return g.kill(p, p2);
            } else if (c.getValue().equals(Value.SEVEN) || c.getValue().equals(Value.NINE)) {
                return g.splitMove(p, p2, c, spaces, forward);
            }
        }
        else {
            return g.move(p, c);
        }
        return false;
    }

    public void createGame(String roomName){
        Game g = new Game(roomName);
        gameList.add(g);
    }

    public Game getGameByRoomName(String roomName){
        for (Game g : this.gameList){
            if (g.getRoomName().equals(roomName)){
                return g;
            }
        }
        return null;
    }

    public boolean updateCard(Turn turn){
        Game g = getGameByRoomName(turn.getRoomName());
        Hand hand = g.getHands()[g.getPlayerTurn()];
        Card[] cards = hand.getCards();
        for (int i = 0; i < cards.length; i++){
            if (cards[i].equals(turn.getCard())){
                cards[i] = g.getRandomCard();
                return true;
            }
        }
        return false;
    }

    public Peg getPeg(Peg p, Player player){
        for (Peg peg : player.getPegs()){
            if (p.equals(peg)){
                return peg;
            }
        }
        for (Peg peg : player.getPartner().getPegs()){
            if (p.equals(peg)){
                return peg;
            }
        }
        return null;
    }

    public int getNumPlayerFromColor(String color){
        return switch (color) {
            case "red" -> 0;
            case "fuchsia" -> 1;
            case "green" -> 2;
            case "blue" -> 3;
            default -> -1;
        };
    }

    public boolean isWinner(String roomName){
        Game g = getGameByRoomName(roomName);
        return g != null && g.isWinner();
    }

    public boolean sendPieceToHeaven(int playerNum) {
        Game g = getGameByRoomName("test");
        Player p = g.getPlayers()[playerNum];
        Peg peg;
        int numPeg = 0;
        do {
            peg = p.getPegs().get(numPeg);
            numPeg++;
        } while (!peg.getInHome() && numPeg < 5);
        boolean success = g.getOut(peg);
        if(!g.sendToHeavensGate(peg)) success = false;
        int spaces = 5 - p.getPegsInHeaven();
        Hole h = g.processMove(peg, spaces, true);
        if (h != null){
            g.addPegToHole(peg, h);
            return true;
        }
        return false;
    }

    public void incrementPlayerTurn(String roomName){
        Game g = getGameByRoomName(roomName);
        g.updatePlayerTurn();
    }
}
