package JavaProjects.CS2114;

// BagDemo.java
// Demonstrates a Bag implementation using an ArrayList.

import java.util.ArrayList;

class Bag<T> {
    private ArrayList<T> items;

    public Bag() {
        items = new ArrayList<>();
    }

    public void add(T item) {
        items.add(item);
    }

    public boolean remove(T item) {
        return items.remove(item);
    }

    public int size() {
        return items.size();
    }

    public boolean contains(T item) {
        return items.contains(item);
    }

    public void display() {
        System.out.println("Bag contents: " + items);
    }
}

public class Bags {
    public static void main(String[] args) {
        Bag<String> myBag = new Bag<>();
        myBag.add("Apple");
        myBag.add("Banana");
        myBag.add("Apple"); // Duplicates allowed
        myBag.display();
        System.out.println("Contains Apple? " + myBag.contains("Apple"));
        myBag.remove("Banana");
        myBag.display();
    }
}

