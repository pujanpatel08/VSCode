 package JavaProjects.CS1114.Polymorphism;

public class Bird {
	
	public String name;
	public int age;
	
	public static void sing() {
		System.out.println("Tweet tweet tweet");
	}
	
	public Bird(String name, int age) {
		this.name = name;
		this.age = age;
	}

	public Bird() {
		this("Pujan", 18);
	}
	
}
