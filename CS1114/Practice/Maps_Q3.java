package CS1114.Practice;

import java.util.HashMap;
import java.util.Map;

public class Maps_Q3 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}
	
	//Write a method called removeLongKeys() that takes in a Map<String, String> and an integer called maxKeyLength. 
	//Return the map after removing all key/value pairs where they key is longer than the specified limit. 
	//You may modify the original map or create a new map.
	
	public Map<String, String> removeLongKeys(Map<String, String> map, int maxKeyLength) {
		Map<String, String> answer = new HashMap<>();
		for (String key : map.keySet()) {
			if(key.length() <= maxKeyLength) {
				answer.put(key,  map.get(key));
			}
		}
		return answer;
	}

}
