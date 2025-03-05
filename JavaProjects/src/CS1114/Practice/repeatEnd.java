package JavaProjects.src.CS1114.Practice;

public class repeatEnd {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		System.out.println(repeatEnd("hello", 5));

	}
	
	public static String repeatEnd(String str, int n) {
	    String temp = "";
	    String word = "";
	    if (n <= str.length()) {
	        temp = str.substring(str.length() - n, str.length());
	    }
	    for (int i = 0; i < n; i++) {
	    	word = word + temp;
	    }
	    return word;

	}
	
}
