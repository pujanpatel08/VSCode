"""
(A) Name: Pujan Patel
    Date: 3/1/2025
    Virginia Tech Honor Code Pledge:
    As a Hokie, I will conduct myself with honor and integrity at all times.
    I will not lie, cheat, or steal, nor will I accept the actions of those who do.
    Assistance Used: I used the assistance of ChatGPT to help me solve this problem as I am fairly certain I would be unable to code this myself. 
    Using chatGPT to solve the porblem was helpful sinc I then asked ChatGPT to explain the code to me. I also used ChatGPT to come up with different test scenarios.

(B) Solution Description:
    This program tackles a variation of the knapsack problem where items are divided into mutually exclusive groups. 
    If one item from a group is chosen, the others cannot be selected. The goal is to maximize the total value of 
    selected items without exceeding a given cost capacity. To solve this, I used a dynamic programming approach 
    that systematically evaluates the best combination of items while considering these constraints.

(C) Problem Solving Steps:
    I started by setting up a 2D dynamic programming table to store the maximum value achievable for different groups 
    and capacities. Then, I iterated over each group and considered all possible capacities. For each item within a group, 
    I checked if adding it to the knapsack would yield a better value than skipping it. The decision-making process 
    involved comparing the previous optimal results and updating them accordingly. Finally, I backtracked through the table 
    to reconstruct the list of selected items.

(D) Challenges Faced:
    One tricky part was ensuring that no two items from the same group were selected. Initially, I had trouble keeping 
    track of item selections properly, which led to incorrect results. I fixed this by carefully copying previous 
    selections and updating them only when an improvement was found. Another challenge was optimizing the nested loops 
    to ensure efficiency, given that the problem has a structured but constrained solution space.

(E) Code Verification:
    Throughout development, I continuously tested the code using different scenarios. I created test cases with various 
    group structures, cost capacities, and edge cases like single-item groups. To automate validation, I used Python’s 
    unittest framework, which allowed me to quickly check correctness across multiple cases and catch errors early.
"""


import unittest

from typing import List, Tuple

def grouped_knapsack(G: int, C: int, items: List[Tuple[int, int]], groups: List[List[int]]) -> Tuple[int, List[int]]:
    dp = [[0] * (C + 1) for _ in range(G + 1)]
    choice = [[[] for _ in range(C + 1)] for _ in range(G + 1)]
    
    for g in range(1, G + 1):
        for capacity in range(C + 1):
            dp[g][capacity] = dp[g - 1][capacity] 
            choice[g][capacity] = choice[g - 1][capacity][:]  
            
            for item_index in groups[g - 1]:
                item_cost, item_value = items[item_index]
                if item_cost <= capacity:
                    new_value = dp[g - 1][capacity - item_cost] + item_value
                    if new_value > dp[g][capacity]:
                        dp[g][capacity] = new_value
                        choice[g][capacity] = choice[g - 1][capacity - item_cost] + [item_index]
    
    return dp[G][C], choice[G][C]

class TestGroupedKnapsack(unittest.TestCase):
    def test_cases(self):
        cases = [
            # Test Case 1: 
            (2, 5, [(1, 2), (2, 4), (2, 3), (3, 5)], [[0, 1], [2, 3]], (9, [1, 3])),
            
            # Test Case 2: 
            (1, 3, [(2, 5)], [[0]], (5, [0])),
            
            # Test Case 3: 
            (1, 4, [(1, 2), (3, 6)], [[0, 1]], (6, [1])),
        ]
        
        for i, (G, C, items, groups, expected) in enumerate(cases):
            with self.subTest(f"Test Case {i+1}"):
                self.assertEqual(grouped_knapsack(G, C, items, groups), expected)

if __name__ == "__main__":
    unittest.main()

