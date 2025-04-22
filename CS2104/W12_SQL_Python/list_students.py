# I have neither given nor received unauthorized assistance on this assignment.
# No generative AI tools were used for writing this script.

import sqlite3

conn = sqlite3.connect('cs_course_scheduling.sqlite')
cursor = conn.execute("SELECT first_name, last_name, academic_year FROM students WHERE academic_year = 2")

with open("students_year2.html", "w") as f:
    f.write("<html><head><title>2nd Year Students</title></head><body>")
    f.write("<h1>2nd Year Students</h1>")
    f.write("<table border='1'>")
    f.write("<tr><th>First Name</th><th>Last Name</th><th>Year</th></tr>")

    for row in cursor:
        f.write(f"<tr><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>")

    f.write("</table></body></html>")

conn.close()
print("students_year2.html created")
