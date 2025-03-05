package JavaProjects.src.CS1114.Strings;

import java.util.Scanner;

public class Strings {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		String str = "all good dogs go to heaven.";
//		char chr = str.charAt(0);
//		System.out.println(chr);
//		
//		// substring is not inclusive for the end bound
//		String sub = str.substring(0, 11);
//		System.out.println(sub);
//		
//		String answer = "";
		Scanner scanner = new Scanner(str);
//		
//		while(scanner.hasNext()) {
//			String temp = scanner.next();
//			if (temp.length() > answer.length()) {
//				answer = temp;
//			}
//		}
		//System.out.println(answer);
		
		System.out.println(longestWord(scanner));
		
	}
	
	public static String longestWord(Scanner scanner) {
        String longestWord = "";
        while (scanner.hasNext()) {
            String word = scanner.next();
            if (word.length() > longestWord.length()) {
                longestWord = word;
            }
        }
        return longestWord;
    }

}
