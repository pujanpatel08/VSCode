package CS1114.Practice;

public class mix_String {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		System.out.println(mixString("Hi", "There"));
		
		for (int i = 0, j = 10; i < j; i++, j--) {
		    System.out.println("i: " + i + ", j: " + j);
		}
		

	}
	
	public static String mixString(String a, String b) {
		int length = 0;
		String remainder = "";
		if (a.length() == b.length()) {
			length = a.length();
		}
		else if (a.length() > b.length()) {
			length = b.length();
			remainder = a.substring(b.length(), a.length());
		}
		else {
			length = a.length();
			remainder = b.substring(a.length(), b.length());
		}
		String word = "";
		String temp = "";
		int i;
		for (i = 0; i < length; i++) {
			temp = a.substring(i, i + 1) + b.substring(i, i + 1);
			word = word + temp;
		}
		
		return word + remainder;
		
	} 

}
