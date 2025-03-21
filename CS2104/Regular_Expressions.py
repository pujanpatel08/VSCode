import re

def contains_only_alphanumeric(string):
    ##Used AI to find out about full match
    if re.fullmatch(r"[a-zA-Z0-9]+", string) is None:
        return False
    else:
        return True 
print(contains_only_alphanumeric("hello!"))

def find_literals(substring, string):
    if re.search(substring, string) is None: 
        return False
    else:
        return True 
sample_text = "The quick brown fox jumps over the lazy dog."
print(find_literals("fox", sample_text))

def remove_parentheses(string):
    return re.sub(r"\s*\(.*?\)", "", string)
print(remove_parentheses("example (.com)"))

def match_words(string):
    words = re.findall(r"\bP\w*", string)  
    return len(words) >= 2  
print(match_words("Python PHP"))