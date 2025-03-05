package JavaProjects.CS1114.Practice;

public class NestedForLoops {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		for (int i = 1; i <= 5; i++) {
			for (int j = 1; j <= 10; j++) {
				System.out.println("i: " + i + " , j: " + j);
			}
		}
		
		System.out.println(tripleLetters("cat"));

	}
	
	public static String tripleLetters(String str)
	{
	    String newString = "";
	    
	    for (int i = 0; i < str.length(); i++) {
	        char letter = str.charAt(i);
	        
	        for (int j = 0; j < 3; j++) {
	            newString = newString + letter;
	        }
	    }

	    return newString;
	}
	
}
