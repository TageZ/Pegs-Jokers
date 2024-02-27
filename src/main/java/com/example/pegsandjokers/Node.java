package com.example.pegsandjokers;

public class Node<E> {

    private E data;
    private Node<E> next;
    private Node<E> fork;

    public Node(E data){
        this.data = data;
        this.next = null;
        this.fork = null;
    }

    public E getData(){
        return this.data;
    }

    public Node<E> getNext(){
        return this.next;
    }

    public void setNext(Node<E> next){
        this.next = next;
    }

    public void setFork(Node<E> fork){
        this.fork = fork;
    }

    public Node<E> getFork(){
        return this.fork;
    }

    @Override
    public String toString(){
        return "Node ";
    }
}
