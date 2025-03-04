package Practice;

public class evenSum {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		System.out.println(evenSum(4));

	}
	
	public static int evenSum(int n) {
	 	int sum = 0;
	    
	    for (int i = 0; i < n; i++) {
	     	sum += (i*2); 
	    }
	    
	    return sum;
	}

}
