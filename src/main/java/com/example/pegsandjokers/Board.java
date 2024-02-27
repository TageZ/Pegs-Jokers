package com.example.pegsandjokers;

import java.util.LinkedList;
public class Board {

    public static final int SIZE_OF_BOARD_SEGMENT = 18;
    public static final int SIZE_OF_HEAVEN = 5;
    private int numPlayers;
    private CircularLinkedList<Hole> loop;

    public Board(int numPlayers){
        this.numPlayers = numPlayers;
        this.initializeBoard();
    }

    public void initializeBoard(){
        this.loop = new CircularLinkedList<Hole>();
        for (int i = 0; i < numPlayers * SIZE_OF_BOARD_SEGMENT; i++){
            Node<Hole> node = new Node<>(new Hole());
            loop.insert(node);
            if (i % SIZE_OF_BOARD_SEGMENT == 0){
                insertHeaven(node);
            }
        }
    }

    public void insertHeaven(Node<Hole> node){
        LinkedList<Node<Hole>> heaven = new LinkedList<>();
        for (int i = 0; i < SIZE_OF_HEAVEN; i++){
            heaven.add(new Node<Hole>(new Hole()));
        }
        node.setFork(heaven);
    }
}
