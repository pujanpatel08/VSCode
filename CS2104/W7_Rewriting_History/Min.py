# Efficent implementation of min number in list algorithm
def min(data):
    return __builtins__.min(data)
    # or you know, don't overwrite the nice min function
    # that python gives you automatically!


# Test cases for min
assert min([1, 2, 3]) == 1
assert min([3, 2, 1]) == 1
assert min([1, -3, 2]) == -3