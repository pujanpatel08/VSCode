package JavaProjects.CS2114;

// ExceptionDemo.java
// Demonstrates exception handling with try-catch-finally and custom exceptions.

class CustomException extends Exception {
    public CustomException(String message) {
        super(message);
    }
}

public class ExceptionHandeling {
    public static void main(String[] args) {
        try {
            int result = divide(10, 0); // This will throw an exception
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.out.println("Exception caught: Cannot divide by zero!");
        } catch (CustomException e) {
            System.out.println("Custom exception: " + e.getMessage());
        } 

        System.out.println("Program continues...");
    }

    public static int divide(int a, int b) throws CustomException {
        if (b == 0) {
            throw new CustomException("Division by zero is not allowed.");
        }
        return a / b;
    }
}