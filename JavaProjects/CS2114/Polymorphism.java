package JavaProjects.CS2114;    
// PolymorphismDemo.java
// Demonstrates method overriding (runtime polymorphism) and method overloading (compile-time polymorphism).

// Base class
class Animal {
    // Method to be overridden by subclasses
    void makeSound() {
        System.out.println("Animal makes a sound.");
    }
}

// Subclass Dog overriding makeSound method
class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Dog barks.");
    }
}

// Subclass Cat overriding makeSound method
class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("Cat meows.");
    }
}

public class Polymorphism {
    // Method Overloading (compile-time polymorphism)
    void display(String message) {
        System.out.println("Message: " + message);
    }

    void display(int number) {
        System.out.println("Number: " + number);
    }

    public static void main(String[] args) {
        // Demonstrating method overriding (runtime polymorphism)
        Animal myAnimal1 = new Dog(); 
        Animal myAnimal2 = new Cat();

        myAnimal1.makeSound(); // Calls Dog's overridden method
        myAnimal2.makeSound(); // Calls Cat's overridden method

        // Demonstrating method overloading
        Polymorphism demo = new Polymorphism();
        demo.display("Hello, world!");
        demo.display(100);
    }
}
