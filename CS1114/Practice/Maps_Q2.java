package CS1114.Practice;

import java.util.List;
import java.util.Map;

public class Maps_Q2 {


	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}
	
	//Write a method called longestInMap() that takes in a map with strings as the keys and lists of strings as the values. 
	//Return the longest list present in the map (the list with the largest size). 
	//If there are no key/value pairs in the map, return null.

	public List<String> longestInMap(Map<String, List<String>> map) {
		List<String> answer = null;
		int max = 0;
		for (String key: map.keySet()) {
			if (map.get(key).size() > max) {
				answer = map.get(key);
				max = map.get(key).size();
			}
		}
		return answer;
	}
}
