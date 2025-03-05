def knapsack(values, weights, W):
    n = len(values)  # Number of items
    # Create a DP table with (n+1) rows and (W+1) columns
    dp = [[0 for _ in range(W+1)] for _ in range(n+1)]

    # Fill the DP table
    for i in range(1, n+1):
        for w in range(1, W+1):
            if weights[i-1] <= w:  # Can include the item
                dp[i][w] = max(dp[i-1][w], dp[i-1][w-weights[i-1]] + values[i-1])
            else:  # Cannot include the item
                dp[i][w] = dp[i-1][w]

    # The bottom-right cell contains the maximum value that can be obtained
    return dp[n][W]

# Example usage
values = [60, 100, 120]  # Item values
weights = [10, 20, 30]  # Item weights
W = 50  # Maximum weight capacity of the knapsack

max_value = knapsack(values, weights, W)
print(f"Maximum value that can be obtained: {max_value}")
