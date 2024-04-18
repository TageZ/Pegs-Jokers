package com.example.pegsandjokers.api.controller.model;

public class Turn {
    private Card card;
    private Peg p;
    private Peg p2;
    private Integer gameID;
    private int spaces;


    public Turn(Card card, Peg p, Integer gameID){
        this.card = card;
        this.p = p;
        this.gameID = gameID;
    }

    public Turn(Card card, Peg p, Peg p2, Integer gameID){
        this.card = card;
        this.p = p;
        this.p2 = p2;
        this.gameID = gameID;
    }

    public Turn(Card card, Peg p, Peg p2, Integer gameID, int spaces){
        this.card = card;
        this.p = p;
        this.p2 = p2;
        this.gameID = gameID;
        this.spaces = spaces;
    }

    public Card getCard() {
        return card;
    }

    public void setCard(Card card) {
        this.card = card;
    }

    public Peg getP() {
        return p;
    }

    public void setP(Peg p) {
        this.p = p;
    }

    public Peg getP2() {
        return p2;
    }

    public void setP2(Peg p2) {
        this.p2 = p2;
    }

    public Integer getGameID() {
        return gameID;
    }

    public void setGameID(Integer gameID) {
        this.gameID = gameID;
    }

    public int getSpaces() {
        return spaces;
    }

    public void setSpaces(int spaces) {
        this.spaces = spaces;
    }
}
