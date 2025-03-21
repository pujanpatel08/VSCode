package CS1114.Practice;

class Monkey {
	String type;
	
	public static String sound() {
		return "Ohh Ahh Ahh";
	}
	
	Monkey(String type) {
		this.type = type;
	}
	
}

public class MonkeyArray {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Monkey m1 = new Monkey("Spider Monkey");
		Monkey m2 = new Monkey("Spider Monkey");
		Monkey m3 = new Monkey("Spider Monkey");
		
		Monkey[] monkeys = {m1, m2, m3};
		System.out.println(m1.sound());
		System.out.println(m1.type);

	}

}
