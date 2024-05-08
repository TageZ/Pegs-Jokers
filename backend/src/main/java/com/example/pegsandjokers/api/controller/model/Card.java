package com.example.pegsandjokers.api.controller.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Card {
    private Value value;

    @JsonCreator
    public Card(@JsonProperty("value") Value value){
        this.value = value;
    }

    public Value getValue(){
        return this.value;
    }

    @Override
    public String toString(){
        return "Value " + this.value.toString();
    }

    @Override
    public boolean equals(Object o){
        if (!(o instanceof Card c)) return false;
        return this.value.equals(c.value);
    }

}
