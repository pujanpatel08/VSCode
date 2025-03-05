package JavaProjects.src.CS1114.Practice;

public class xyzThere {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		

	}
	
	public boolean xyzThere(String str)
	{
	    for (int i = 0; i <= str.length() - 3; i++) {
	        if (str.substring(i, i + 3).equals("xyz")) {
	            if (str.charAt(i - 1) != '.' || i == 0) {
	            	return true;
	            }
	        }
	    }
	    return false;
	}
	
	public boolean xyzThere(String str) {
	    for (int i = 0; i <= str.length() - 3; i++) {
	        	        if (str.substring(i, i + 3).equals("xyz")) {
	            	            if (i == 0 || str.charAt(i - 1) != '.') {
	                return true;
	            }
	        }
	    }
	    return false;
	}



}
