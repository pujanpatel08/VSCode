package CS1114.Practice;

public class Multiples_Of_3 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		System.out.println(multiplesOf3(19));
	}
	
	public static String multiplesOf3(int n)
	{
	    String multiples = "";
	    // Fill in the components of the for loop!
	    for (int i = 3; i <= n*3; i+=3)
	    {
	        multiples = multiples + i;
	    }
	    return multiples;
	}

}
