package CS2114;

// LinkedBagDemo.java
// Demonstrates a linked list-based bag.

class LinkedBag<T> {
    private Node<T> head;
    private int size;

    public LinkedBag() {
        head = null;
        size = 0;
    }

    public void add(T item) {
        Node<T> newNode = new Node<>(item);
        newNode.next = head;
        head = newNode;
        size++;
    }

    public boolean remove(T item) {
        Node<T> current = head, prev = null;
        while (current != null) {
            if (current.data.equals(item)) {
                if (prev == null) head = current.next;
                else prev.next = current.next;
                size--;
                return true;
            }
            prev = current;
            current = current.next;
        }
        return false;
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

public class LinkedBags {
    public static void main(String[] args) {
        LinkedBag<String> bag = new LinkedBag<>();
        bag.add("Apple");
        bag.add("Banana");
        bag.add("Apple");
        bag.display();
    }
}

