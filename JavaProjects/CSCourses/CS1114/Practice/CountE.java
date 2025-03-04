package Practice;

import java.util.ArrayList;

public class CountE {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		ArrayList<String> list = new ArrayList<>();
		list.add("Patel");
		list.add("Peter");
		list.add("Injure");
		list.add("Table");
		
		System.out.println(countEs(list));

		
	}
	
	public static int countEs(ArrayList<String> list) {
	    int counter = 0;
	    
	    for (int i = 0; i < list.size(); i++) {
	        String s = list.get(i);
	        
	        for (int j = 0; j < s.length(); j++) {
	            char c = s.charAt(j);
	            if (c == 'e') {
	                counter++;
	            }
	        }
	    }
	    return counter;
	}

}
