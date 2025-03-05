package JavaProjects.src.CS1114.Practice;

public class Aggregation {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		Car car = new Car(); // Engine cannot exist without Car
        Engine engine = new Engine();
        car.startCar();
        
	}
	
	// Class representing an Engine
	public static class Engine {
	    public void start() {
	        System.out.println("Engine started");
	    }
	}

	// Class representing a Car, which is composed of Engine
	public static class Car {
	    private Engine engine; // Composition (Engine is part of Car)

	    public Car() {
	        this.engine = new Engine(); // Engine is created inside Car
	    }

	    public void startCar() {
	        engine.start();
	        System.out.println("Car is running");
	    }
	}


}
