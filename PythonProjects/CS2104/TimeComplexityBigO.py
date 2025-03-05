# O(1) - Constant Time Complexity
def constant_time_example(arr):
    # Accessing a single element in an array takes constant time
    # The time does not depend on the size of the input array
    return arr[0]

# O(log n) - Logarithmic Time Complexity
def binary_search(arr, target):
    # Binary search works by repeatedly dividing the array in half
    # The size of the problem reduces by half at each step
    # This makes binary search logarithmic time (O(log n))
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2  # Find the middle element
        if arr[mid] == target:     # If found, return the index
            return mid
        elif arr[mid] < target:    # If target is greater, search the right half
            left = mid + 1
        else:                       # If target is smaller, search the left half
            right = mid - 1
    return -1  # Target not found

# O(n) - Linear Time Complexity
def linear_time_example(arr):
    # In linear time, the algorithm processes each element of the array once
    # The time taken is directly proportional to the size of the input array
    total = 0
    for num in arr:
        total += num  # Add each number in the array to the total
    return total

# O(n log n) - Linearithmic Time Complexity (Merge Sort)
def merge_sort(arr):
    # Merge Sort works by dividing the array into halves, sorting them, and then merging them
    # The time complexity is O(n log n) because the array is divided log n times, and each merge takes O(n) time
    if len(arr) > 1:
        mid = len(arr) // 2  # Finding the mid of the array
        left_half = arr[:mid]  # Left half of the array
        right_half = arr[mid:]  # Right half of the array

        merge_sort(left_half)  # Recursively sort the left half
        merge_sort(right_half)  # Recursively sort the right half

        i = j = k = 0  # Initialize indices for left, right, and merged array
        while i < len(left_half) and j < len(right_half):
            if left_half[i] < right_half[j]:
                arr[k] = left_half[i]
                i += 1
            else:
                arr[k] = right_half[j]
                j += 1
            k += 1

        while i < len(left_half):  # Add remaining elements from left half
            arr[k] = left_half[i]
            i += 1
            k += 1

        while j < len(right_half):  # Add remaining elements from right half
            arr[k] = right_half[j]
            j += 1
            k += 1

    return arr

# O(n^2) - Quadratic Time Complexity (Bubble Sort)
def bubble_sort(arr):
    # Bubble Sort is a basic sorting algorithm where adjacent elements are compared and swapped
    # The time complexity is O(n^2) because of the nested loops
    # The outer loop runs n times, and the inner loop runs n-i times for each outer loop iteration
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:  # Swap elements if out of order
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# O(2^n) - Exponential Time Complexity (Fibonacci)
def fibonacci(n):
    # The naive Fibonacci algorithm uses recursion to calculate Fibonacci numbers
    # Each call generates two more calls, leading to exponential growth in the number of calls
    # This results in O(2^n) time complexity
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Demonstrating all Big O complexities with examples
def big_o_examples():
    # O(1) Example
    arr = [1, 2, 3, 4, 5]
    print("O(1) - Constant Time Example:", constant_time_example(arr))  # Output: 1

    # O(log n) Example
    arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    print("O(log n) - Binary Search Index of 5:", binary_search(arr, 5))  # Output: 4

    # O(n) Example
    print("O(n) - Linear Time Example Sum:", linear_time_example(arr))  # Output: 55

    # O(n log n) Example
    unsorted_arr = [38, 27, 43, 3, 9, 82, 10]
    print("O(n log n) - Merge Sort:", merge_sort(unsorted_arr))  # Output: [3, 9, 10, 27, 38, 43, 82]

    # O(n^2) Example
    unsorted_arr2 = [64, 34, 25, 12, 22, 11, 90]
    print("O(n^2) - Bubble Sort:", bubble_sort(unsorted_arr2))  # Output: [11, 12, 22, 25, 34, 64, 90]

    # O(2^n) Example
    print("O(2^n) - Fibonacci of 5:", fibonacci(5))  # Output: 5

if __name__ == "__main__":
    big_o_examples()
