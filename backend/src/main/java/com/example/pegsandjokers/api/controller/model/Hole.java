package com.example.pegsandjokers.api.controller.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.UUID;

@JsonSerialize(using = HoleSerializer.class)
public class Hole {

    private UUID id;
    private UUID fork;
    private Peg peg;
    private boolean isHeavensGate;
    private boolean isHomeStep;

    public Hole(UUID id){
        this.id = id;
        this.peg = null;
        this.isHeavensGate = false;
        this.isHomeStep = false;
    }

    public Peg getPeg() {
        return peg;
    }

    public void setPeg(Peg peg) {
        this.peg = peg;
    }
    
    public void removePeg(){
        this.peg = null;
    }

    public boolean isHeavensGate(){
        return this.isHeavensGate;
    }

    public void setHeavensGate(){
        this.isHeavensGate = true;
    }


    public boolean isHomeStep() {
        return isHomeStep;
    }

    public void setHomeStep() {
        isHomeStep = true;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getFork() {
        return fork;
    }

    public void setFork(UUID fork) {
        this.fork = fork;
    }

    @Override
    public String toString(){
        return "Hole id: " + this.id + ", Peg: " + this.peg;
    }

    @Override
    public boolean equals(Object o){
        if (!(o instanceof Hole h)) return false;
        return this.id.equals(h.getId());
    }
}
