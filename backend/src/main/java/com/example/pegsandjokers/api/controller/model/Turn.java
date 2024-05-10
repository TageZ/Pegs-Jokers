package com.example.pegsandjokers.api.controller.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Turn {
    private Card card;
    private Peg p;
    private Peg p2;
    private String roomName;
    private int spaces;
    private boolean forward;

    @JsonCreator
    public Turn(@JsonProperty("card")Card card, @JsonProperty("p")Peg p, @JsonProperty("p2")Peg p2, @JsonProperty("roomName")String roomName, @JsonProperty("spaces")int spaces, @JsonProperty("forward")boolean forward){
        this.card = card;
        this.p = p;
        this.p2 = p2;
        this.roomName = roomName;
        this.spaces = spaces;
        this.forward = forward;
    }

    public Card getCard() {
        return card;
    }


    public Peg getP() {
        return p;
    }

    public Peg getP2() {
        return p2;
    }

    public String getRoomName(){
        return this.roomName;
    }

    public int getSpaces() {
        return spaces;
    }

    public boolean isForward() {
        return forward;
    }

    @Override
    public String toString(){
        return "Card: " + this.card + ", Peg: " + this.p;
    }
}
