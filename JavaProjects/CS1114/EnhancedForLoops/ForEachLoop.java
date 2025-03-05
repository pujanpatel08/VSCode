package JavaProjects.CS1114.EnhancedForLoops;

import java.util.ArrayList;

public class ForEachLoop {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		String[] cars = {"BMW", "Toyota", "Honda"};
		int x = cars.length;
		ArrayList<Integer> numbers = new ArrayList<>();
		numbers.add(0);
		numbers.add(1);
		numbers.add(2);
		numbers.add(3);
		numbers.add(4);
		numbers.add(5);
		numbers.add(6);
		numbers.add(7);
		numbers.add(8);
		numbers.add(9);
		
		for (int num : numbers) {
			System.out.println(num);
		}
		
		System.out.println("");
		
		for (int i = 0; i < numbers.size(); i++) {
			int num = numbers.get(i);
			System.out.println(num);
		}
		
		System.out.println("");
		
		for (String car : cars) {
			System.out.println(car);
		}
		
		System.out.println("");
		
		for (int i = 0; i < cars.length; i++) {
			String car = cars[i];
			System.out.println(car);
		}
		
		System.out.println("");
		
		int size = numbers.size();

		for (int index = 0; index < size; index++) {
			numbers.remove(0);
		}
		System.out.println(numbers);
	}

}
