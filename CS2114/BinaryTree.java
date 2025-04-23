package CS2114;

/**
 * A simple implementation of a Binary Tree data structure.
 */
public class BinaryTree<T> {
    // Node class for the tree
    private static class Node<T> {
        T data;
        Node<T> left;
        Node<T> right;

        Node(T data) {
            this.data = data;
            left = null;
            right = null;
        }
    }

    private Node<T> root;

    // Constructor
    public BinaryTree() {
        root = null;
    }

    // Insert a value into the binary tree (as a BST)
    public void insert(T data) {
        root = insertRec(root, data);
    }

    private Node<T> insertRec(Node<T> root, T data) {
        if (root == null) {
            root = new Node<>(data);
            return root;
        }

        // Assuming T is Comparable
        if (((Comparable<T>) data).compareTo(root.data) < 0) {
            root.left = insertRec(root.left, data);
        } else if (((Comparable<T>) data).compareTo(root.data) > 0) {
            root.right = insertRec(root.right, data);
        }

        return root;
    }

    // Traverse the tree in-order (Left, Root, Right)
    public void inorderTraversal() {
        inorderRec(root);
        System.out.println();
    }

    private void inorderRec(Node<T> root) {
        if (root != null) {
            inorderRec(root.left);
            System.out.print(root.data + " ");
            inorderRec(root.right);
        }
    }

    // Search for a value in the tree
    public boolean search(T data) {
        return searchRec(root, data);
    }

    private boolean searchRec(Node<T> root, T data) {
        if (root == null || root.data.equals(data)) {
            return root != null;
        }

        if (((Comparable<T>) data).compareTo(root.data) < 0) {
            return searchRec(root.left, data);
        }

        return searchRec(root.right, data);
    }

    // Get height of the tree
    public int getHeight() {
        return getHeightRec(root);
    }

    private int getHeightRec(Node<T> root) {
        if (root == null) {
            return 0;
        }
        return Math.max(getHeightRec(root.left), getHeightRec(root.right)) + 1;
    }

    // Main method with example usage
    public static void main(String[] args) {
        BinaryTree<Integer> tree = new BinaryTree<>();
        
        // Insert some values
        tree.insert(50);
        tree.insert(30);
        tree.insert(70);
        tree.insert(20);
        tree.insert(40);
        tree.insert(60);
        tree.insert(80);
        tree.insert(90);

        System.out.println("Inorder traversal of the tree:");
        tree.inorderTraversal();

        System.out.println("Height of the tree: " + tree.getHeight());
        System.out.println("Search for 40: " + tree.search(40));
        System.out.println("Search for 90: " + tree.search(90));
        System.out.println("Search for 100: " + tree.search(100));
    }
}