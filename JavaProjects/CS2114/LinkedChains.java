package JavaProjects.CS2114;

// LinkedChainDemo.java
// Demonstrates a simple linked chain (singly linked list).

class Node<T> {
    T data;
    Node<T> next;

    Node(T data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedChain<T> {
    private Node<T> head;

    public void add(T data) {
        Node<T> newNode = new Node<>(data);
        newNode.next = head;
        head = newNode;
    }

    public void display() {
        Node<T> current = head;
        while (current != null) {
            System.out.print(current.data + " -> ");
            current = current.next;
        }
        System.out.println("null");
    }
}

public class LinkedChains {
    public static void main(String[] args) {
        LinkedChain<Integer> chain = new LinkedChain<>();
        chain.add(10);
        chain.add(20);
        chain.add(30);
        chain.display();
    }
}

