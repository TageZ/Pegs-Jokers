package com.example.pegsandjokers.api.controller.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(using = HandSerializer.class)
public class Hand {
    private Integer playerID;
    private Card[] cards;
    public static final int SIZE_OF_HAND = 5;

    public Hand(Integer playerID, Deck deck){
        this.playerID = playerID;
        this.cards = new Card[SIZE_OF_HAND];
        for (int i = 0; i < SIZE_OF_HAND; i++){
            this.cards[i] = deck.getRandomCard();
        }
    }

    public Card[] getCards() {
        return this.cards;
    }

    public Integer getPlayerID() {
        return this.playerID;
    }
}
