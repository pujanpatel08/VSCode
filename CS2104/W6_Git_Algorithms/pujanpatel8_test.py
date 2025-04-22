'''
Created on February 28, 2025

@author Pujan Patel
'''

import unittest
from algorithm import across_bridge

class TestAcrossBridge(unittest.TestCase):
    def test_equal_times(self):
        self.assertEqual(across_bridge([3, 3, 3, 3]), 15)  

    def test_standard_case(self):
        self.assertEqual(across_bridge([1, 3, 5, 10]), 20)  
        self.assertEqual(across_bridge([1, 5, 3, 10]), 20)  
        self.assertEqual(across_bridge([3, 1, 5, 10]), 20)  
        self.assertEqual(across_bridge([3, 5, 1, 10]), 20)  
        self.assertEqual(across_bridge([5, 1, 3, 10]), 20)  
        self.assertEqual(across_bridge([5, 3, 1, 10]), 20)  
        self.assertEqual(across_bridge([10, 1, 3, 5]), 20)  
        self.assertEqual(across_bridge([10, 1, 5, 3]), 20)  
        self.assertEqual(across_bridge([10, 3, 1, 5]), 20)  
        self.assertEqual(across_bridge([10, 3, 5, 1]), 20)  
        self.assertEqual(across_bridge([10, 5, 1, 3]), 20)  
        self.assertEqual(across_bridge([10, 5, 3, 1]), 20)  

    def test_alternate_scenario(self):
        self.assertEqual(across_bridge([2, 4, 6, 10]), 24)  
        self.assertEqual(across_bridge([4, 2, 6, 10]), 24)  
        self.assertEqual(across_bridge([6, 2, 4, 10]), 24)  
        self.assertEqual(across_bridge([10, 2, 4, 6]), 24)  

    def test_case_with_one_fast_person(self):
        self.assertEqual(across_bridge([1, 10, 15, 20]), 51)  
        self.assertEqual(across_bridge([10, 1, 15, 20]), 51)  
        self.assertEqual(across_bridge([15, 1, 10, 20]), 51)  
        self.assertEqual(across_bridge([20, 1, 10, 15]), 51)  

    def test_case_with_two_fast_people(self):
        self.assertEqual(across_bridge([1, 2, 10, 20]), 27)  
        self.assertEqual(across_bridge([2, 1, 10, 20]), 27)  
        self.assertEqual(across_bridge([10, 1, 2, 20]), 27)  
        self.assertEqual(across_bridge([20, 1, 2, 10]), 27)  

if __name__ == "__main__":
    unittest.main()
