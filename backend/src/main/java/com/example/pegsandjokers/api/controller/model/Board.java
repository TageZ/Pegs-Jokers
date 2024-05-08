package com.example.pegsandjokers.api.controller.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Board {

    public static final int SIZE_OF_BOARD_SEGMENT = 18;
    public static final int SIZE_OF_HEAVEN = 5;
    public static final int INDEX_HEAVENS_GATE = 2;
    public static final int INDEX_HOME_STEP = 7;
    private static final int NUM_PLAYERS = 4;
    private Player[] players;
    private Hole[] loop;
    private Hole[][] heavens;
    private Hole[][] homes;

    public Board(Player[] players){
        this.players = players;
        this.initializeBoard();
        this.initializePegs();
    }

    public void initializeBoard(){
        final int BOARD_SIZE = NUM_PLAYERS * SIZE_OF_BOARD_SEGMENT;
        this.loop = new Hole[BOARD_SIZE];
        this.heavens = new Hole[NUM_PLAYERS][SIZE_OF_HEAVEN];
        for (int i = 0; i < BOARD_SIZE; i++){
            int numPlayer = i / SIZE_OF_BOARD_SEGMENT;
            Hole h = new Hole(UUID.randomUUID());
            this.loop[i] = h;
            if (i % SIZE_OF_BOARD_SEGMENT == INDEX_HEAVENS_GATE){
                this.players[numPlayer].setHeavensGate(h);
                h.setHeavensGate();
                insertHeaven(h, numPlayer);
            }
            if (i % SIZE_OF_BOARD_SEGMENT == INDEX_HOME_STEP){
                h.setHomeStep();
                this.players[numPlayer].setHomeStep(h);
            }
        }
    }

    public void insertHeaven(Hole gate, int num){
        Hole[] heaven = new Hole[SIZE_OF_HEAVEN];
        for (int i = 0; i < heaven.length; i++) {
            Hole h = new Hole(UUID.randomUUID());
            heaven[i] = h;
        }

        gate.setFork(heaven[0].getId());
        this.heavens[num] = heaven;
    }

    public int getHoleIndex(Hole h) {
        for (int i = 0; i < loop.length; i++){
            if (this.loop[i].equals(h)){
                return i;
            }
        }
        return -1;
    }

    public int getHeavenIndex(Integer playerID, UUID id) {
        for (int i = 0; i < this.heavens[playerID].length; i++){
            if (this.heavens[playerID][i].getId().equals(id)){
                return i;
            }
        }
        return -1;
    }

    public Hole[] getLoop(){
        return this.loop;
    }

    public Hole[][] getHeavens() {
        return this.heavens;
    }

    public void initializePegs(){
        this.homes = new Hole[this.players.length][this.players[0].getPegs().size()];
        for (int i = 0; i < this.homes.length; i++){
            Hole[] home = this.homes[i];
            Player player = this.players[i];
            List<Peg> pegs = player.getPegs();
            for (int j = 0; j < this.homes[i].length; j++){
                Peg p = pegs.get(j);
                Hole h = new Hole(UUID.randomUUID());
                home[j] = h;
                h.setPeg(p);
                p.setHole(h);
            }
        }
    }

    public Hole[][] getHomes() {
        return this.homes;
    }
}