package CS1114.Practice;

public class hasBad {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		System.out.println(hasBad("babadxx"));

	}
	
	public static boolean hasBad(String str)
	{
	    int index = 0;
	    if (str.contains("bad")) {
	     	index = str.indexOf("b");
	        if (index <= 1 && str.indexOf("a") == index + 1 && str.indexOf("d") == index + 2) {
	            return true;
	        }
	        
	    }
	    return false;
	}

}
