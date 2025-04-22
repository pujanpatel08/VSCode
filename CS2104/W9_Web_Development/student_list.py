"""
@date: March 26 2025
@author: Pujan Patel
@PID: pujanpatel8
@assignment: W9 CW Reading data off html
AI Assitance: I used AI to help me fill out this script and explain to me how it works
"""

import re

# Define file names for input and output
in_filename = 'student_list.html'
out_filename = 'student_list.txt'

# Open the input HTML file and the output text file
content = open(in_filename, "r")
output = open(out_filename, "w")  # Open in write mode to overwrite content

# Read the HTML content
html_text = content.read()

# Regular expression pattern to match first name, last name, and year (only first-year students, i.e., year = 1)
pattern = r'<tr>\s*<td>(\w+)<\/td>\s*<td>(\w+)<\/td>\s*<td>1<\/td>\s*<\/tr>'

# Find all matches using regex
matches = re.findall(pattern, html_text)

# Loop through each match and write the formatted output (Last Name, First Name, Grade)
for match in matches:
    first_name, last_name = match
    grade = '1'  # All matched students are first-year (Grade 1)
    output.write(f"{last_name}, {first_name}, {grade}\n")

# Close the input and output file streams
output.close()
content.close()

print(f"Student list of first-year students has been written to {out_filename}")
