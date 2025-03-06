package JavaProjects.CS2114;

// StackDemo.java
// Demonstrates a stack using a linked list.

class Stack<T> {
    private Node<T> top;

    public void push(T data) {
        Node<T> newNode = new Node<>(data);
        newNode.next = top;
        top = newNode;
    }

    public T pop() {
        if (top == null) {
            throw new RuntimeException("Stack underflow");
        }
        T data = top.data;
        top = top.next;
        return data;
    }

    public void display() {
        Node<T> current = top;
        while (current != null) {
            System.out.print(current.data + " -> ");
            current = current.next;
        }
        System.out.println("null");
    }
}

public class Stacks {
    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>();
        stack.push(10);
        stack.push(20);
        stack.push(30);
        stack.display();
        System.out.println("Popped: " + stack.pop());
        stack.display();
    }
}

