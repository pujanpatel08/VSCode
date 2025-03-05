package Practice;

public class concatinatingStrings {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		System.out.println(swapNameFormatting("Pujan , Patel"));
		System.out.println(createNumberString(10));
		int x = 123456789;
		String str = Integer.toString(x);
		String str2 = String.valueOf(x);
		System.out.println(str);
		System.out.println(str2);


	}
	
	public static String swapNameFormatting(String name)
	{
		String[] array = name.split(",");
	    return array[1] + ", " + array[0];
	}
	
	public static String createNumberString(int n)
	{
	    String answer = "";
	    
	    for (int i = 1; i <= n; i++) {
	    	answer += i;
	    }
	    
	    return answer;
	}

}
