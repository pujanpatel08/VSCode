package JavaProjects.CS2114;

public class Recursion {

    // Factorial function: n! = n * (n-1) * ... * 1
    public static int factorial(int n) {
        if (n == 0) { // Base case
            return 1;
        }
        return n * factorial(n - 1); // Recursive case
    }

    // Fibonacci sequence: F(n) = F(n-1) + F(n-2)
    public static int fibonacci(int n) {
        if (n == 0) { // Base case
            return 0;
        } else if (n == 1) { // Base case
            return 1;
        }
        return fibonacci(n - 1) + fibonacci(n - 2); // Recursive case
    }

    // Sum of an array using recursion
    public static int sumArray(int[] arr, int n) {
        if (n <= 0) { // Base case
            return 0;
        }
        return arr[n - 1] + sumArray(arr, n - 1); // Recursive case
    }

    public static void main(String[] args) {
        // Test factorial
        System.out.println("Factorial of 5: " + factorial(5));
        
        // Test Fibonacci
        System.out.println("Fibonacci of 6: " + fibonacci(6));
        
        // Test sumArray
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.println("Sum of array: " + sumArray(numbers, numbers.length));
    }
}
