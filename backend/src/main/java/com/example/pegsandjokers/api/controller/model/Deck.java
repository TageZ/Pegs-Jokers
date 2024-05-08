package com.example.pegsandjokers.api.controller.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Deck {

    private List<Card> cards;
    private static final int JOKERS = 2;
    private static final int CARDS = 4;

    public Deck(){
        this.initializeDeck();
        this.shuffle();
    }

    public void initializeDeck(){
        this.cards = new ArrayList<>();
        for (Value v : Value.values()){
            if (v.equals(Value.JOKER)){
                for (int i = 0; i < JOKERS; i++){
                    this.cards.add(new Card(Value.JOKER));
                }
            } else {
                for (int i = 0; i < CARDS; i++){
                    this.cards.add(new Card(v));
                }
            }
        }
    }

    public Card getRandomCard(){
        if (this.cards.isEmpty()){
            this.initializeDeck();
            this.shuffle();
        }

        return this.cards.remove(0);
    }

    public void shuffle(){
        Collections.shuffle(this.cards);
    }

    public List<Card> getCards(){
        return this.cards;
    }
}
