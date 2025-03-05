package JavaProjects.CS1114.Practice;

public class findLastSpace {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		System.out.println(indexOfLastSpace("I'm making waffles"));

	}
	
	public static int indexOfLastSpace(String phrase)
	{
		int lastSpaceIndex = 0;
		for (int i = 0; i < phrase.length(); i++) {
	        if (phrase.charAt(i) == ' ') {
	            lastSpaceIndex = i; // Update the last seen space index
	        }
	    }
	    
	    return lastSpaceIndex;
	}

}
