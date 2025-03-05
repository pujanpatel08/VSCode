package Inheritance;

import Polymorphism.Bird;

public class Main {

	public static void main(String[] args) {
		Bird.sing();
		Bird b = new Bird("Deepu", 19);
		System.out.println(b.name + " " + b.age);

	}

}
