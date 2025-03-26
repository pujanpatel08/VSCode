package CS1114.Practice;

public class count_Elements {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		count_Elements count = new count_Elements();
		System.out.println(count.countElements(null, 0));

	}
	
	public int countElements(int[] nums, int target) {
		
		int count = 0;
		for (int i = 0; i < nums.length; i++) {
			if (nums[i] == target) {
				count++;
			}
		}
		return count;
	    
	}

}
