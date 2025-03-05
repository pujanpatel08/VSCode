import re

# Let's start by using some basic patterns
def basic_regex_examples():
    text = "Hello, my name is Alice. I am 25 years old and my number is 123-456-7890."
    
    # Example 1: Matching the word "name"
    match_name = re.search(r"name", text)
    if match_name:
        print(f"Found: {match_name.group()}")
    
    # Example 2: Match a number (digits)
    match_number = re.search(r"\d+", text)
    if match_number:
        print(f"Found first number: {match_number.group()}")
    
    # Example 3: Matching a phone number pattern (XXX-XXX-XXXX)
    match_phone = re.search(r"\d{3}-\d{3}-\d{4}", text)
    if match_phone:
        print(f"Found phone number: {match_phone.group()}")
    
    # Example 4: Match an email (simple pattern)
    text_with_email = "Contact me at example@example.com"
    match_email = re.search(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b", text_with_email)
    if match_email:
        print(f"Found email: {match_email.group()}")
        
    # Example 5: Match any word starting with a capital letter
    match_capital_words = re.findall(r"\b[A-Z][a-z]*\b", text)
    print(f"Capital words found: {match_capital_words}")

# Test the basic regex examples
basic_regex_examples()

# Example 6: Using re.findall() to find all occurrences of a pattern
def find_all_numbers():
    text = "My zip codes are 12345 and 67890."
    numbers = re.findall(r"\d{5}", text)
    print(f"Found zip codes: {numbers}")

# Test find_all_numbers
find_all_numbers()

# Example 7: Using re.sub() to replace text
def replace_example():
    text = "The sky is blue. The grass is green."
    modified_text = re.sub(r"blue", "red", text)  # Replace 'blue' with 'red'
    print(f"Modified text: {modified_text}")

# Test replace_example
replace_example()

