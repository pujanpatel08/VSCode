def leap_year(year):
    if year % 400 == 0:
        return True
    elif year % 4 == 0 and year % 100 != 0:
        return True
    else:
        return False

import unittest

class TestLeapYear(unittest.TestCase):
    def test_leap_year_run1(self):
        self.assertTrue(leap_year(2000))
        self.assertTrue(leap_year(2004))
        
        # Test cases for non-leap years
        self.assertFalse(leap_year(2001))
        self.assertFalse(leap_year(2100))

if __name__ == "__main__":
    unittest.main()
