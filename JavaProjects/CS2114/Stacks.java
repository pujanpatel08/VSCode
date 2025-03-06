package JavaProjects.CS2114;
class Stack<T> {
    private Node<T> top;

    public void push(T data) {
        Node<T> newNode = new Node<>(data);
        newNode.next = top;
        top = newNode;
    }

    @SuppressWarnings("unchecked")
    public T pop() {
        try {
            T data = top.data;
            top = top.next;
            return data;
        } catch (RuntimeException e) {
            System.out.println("RuntimeException Stack underflow: " + e.getMessage());
        }
        return (T)"Nothing left to pop"; 
    }

    @SuppressWarnings("unchecked")
    public T peek() {
        if (top != null) {
            return top.data;
        }
        return (T)"Nothing left to peek"; 
    }    

    public void display() {
        Node<T> current = top;
        System.out.print("Display: ");
        while (current != null) {
            System.out.print(current.data + " -> ");
            current = current.next;
        }
        System.out.println("Nothing Left");
    }
}

public class Stacks {
    public static void main(String[] args) {
        Stack<String> stack = new Stack<>();
        stack.push("1000");
        stack.push("2000");
        stack.push("3000");
        System.out.println("Top value: " + stack.peek());
        stack.display();
        System.out.println("Popped: " + stack.pop());
        stack.display();
    }
}