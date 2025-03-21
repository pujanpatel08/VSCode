package CS1114.Practice;

public class PlusOut {

	public static void main(String[] args) {
		System.out.println(plusOut("12xxx34", "xxx"));

	}
	
	public static String plusOut(String str, String word) {
	    String ans = "";  	    
	    int wl = word.length();  	  
	    int sl = str.length();   	    
	    for (int i = 0; i < sl; i++) {
	    	if (i + wl <= sl && str.substring(i, i + wl).equals(word)) {
	    		ans += word;  	           
	        	i += wl - 1;  
	        } 
	        else {
	            ans += "+";  	        
	        }
	    }
	    
	    return ans;  	}

}
