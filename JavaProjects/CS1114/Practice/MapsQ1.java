package JavaProjects.CS1114.Practice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MapsQ1 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}
	
	//Write a method called listToMap() that takes in a list of strings and returns a Map<String, Integer>, 
	//where the keys in the map are the strings from the list, and the corresponding value for each key is 
	//that key's length (number of characters in the key).
	
	public Map<String, Integer> listToMap(List<String> keys) {
		Map <String, Integer> map = new HashMap <String, Integer>();
		for (String key : keys) {
			map.put(key, key.length());
		}
		return map;
	}

}
