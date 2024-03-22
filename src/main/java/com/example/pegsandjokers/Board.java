package com.example.pegsandjokers;
public class Board {

    public static final int SIZE_OF_BOARD_SEGMENT = 18;
    public static final int SIZE_OF_HEAVEN = 5;
    private final int NUM_PLAYERS;
    private CircularLinkedList<Hole> loop;

    public Board(int numPlayers){
        this.NUM_PLAYERS = numPlayers;
        this.initializeBoard();
    }

    public void initializeBoard(){
        this.loop = new CircularLinkedList<Hole>();
        for (int i = 0; i < NUM_PLAYERS * SIZE_OF_BOARD_SEGMENT; i++){
            int numPlayer = i / SIZE_OF_BOARD_SEGMENT;
            Node<Hole> node = new Node<>(new Hole(numPlayer));
            loop.insert(node);
            if (i % SIZE_OF_BOARD_SEGMENT == 0){
                insertHeaven(node, numPlayer);
            }
        }
    }

    public void insertHeaven(Node<Hole> node, int num){
        LinkedList<Hole> heaven = new LinkedList<>();
        for (int i = 0; i < SIZE_OF_HEAVEN; i++) {
            Node<Hole> newNode = new Node<>(new Hole(num));
            heaven.insert(newNode);
        }
        node.setFork(heaven.getFirst());
    }

    public CircularLinkedList<Hole> getLoop(){
        return this.loop;
    }
}