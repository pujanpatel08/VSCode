package CS2114;

// ExceptionDemo.java
// Demonstrates exception handling with try-catch-finally and custom exceptions.

import java.io.*;
import java.util.InputMismatchException;

/**
 * This class demonstrates exception handling in Java, including checked and unchecked exceptions.
 */
public class ExceptionHandling {
    
    /**
     * Demonstrates handling different types of exceptions.
     */
    public static void main(String[] args) {
        try {
            // ArithmeticException (Unchecked Exception)
            int result = divide(10, 0);
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.out.println("Caught ArithmeticException: " + e.getMessage());
        }
        
        try {
            // ArrayIndexOutOfBoundsException (Unchecked Exception)
            accessInvalidArrayIndex();
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Caught ArrayIndexOutOfBoundsException: " + e.getMessage());
        }
        
        try {
            // NullPointerException (Unchecked Exception)
            triggerNullPointerException();
        } catch (NullPointerException e) {
            System.out.println("Caught NullPointerException: " + e.getMessage());
        }
        
        try {
            // FileNotFoundException (Checked Exception)
            readFile("nonexistent.txt");
        } catch (FileNotFoundException e) {
            System.out.println("Caught FileNotFoundException: " + e.getMessage());
        }
        
        try {
            // InputMismatchException (Unchecked Exception)
            triggerInputMismatch();
        } catch (InputMismatchException e) {
            System.out.println("Caught InputMismatchException: " + e.getMessage());
        }
        
        try {
            // Custom Exception
            validateAge(15);
        } catch (InvalidAgeException e) {
            System.out.println("Caught Custom Exception: " + e.getMessage());
        }
    }
    
    // Method that throws an ArithmeticException
    public static int divide(int a, int b) {
        return a / b; // Throws ArithmeticException if b is 0
    }
    
    // Method that triggers ArrayIndexOutOfBoundsException
    public static void accessInvalidArrayIndex() {
        int[] numbers = {1, 2, 3};
        System.out.println(numbers[5]); // Invalid index
    }
    
    // Method that triggers NullPointerException
    public static void triggerNullPointerException() {
        String str = null;
        System.out.println(str.length()); // Null reference
    }
    
    // Method that throws a checked exception (FileNotFoundException)
    public static void readFile(String filePath) throws FileNotFoundException {
        FileReader fileReader = new FileReader(filePath); // Must be handled or declared
    }
    
    // Method that triggers InputMismatchException
    public static void triggerInputMismatch() {
        java.util.Scanner scanner = new java.util.Scanner("abc");
        int number = scanner.nextInt(); // Expects an integer, gets a string
    }
    
    // Method that throws a custom exception
    public static void validateAge(int age) throws InvalidAgeException {
        if (age < 18) {
            throw new InvalidAgeException("Age must be 18 or above.");
        }
        System.out.println("Valid age: " + age);
    }
}

/**
 * Custom exception class to handle invalid age scenarios.
 */
class InvalidAgeException extends Exception {
    public InvalidAgeException(String message) {
        super(message);
    }
}
