def solve_n_queens(n):
    def is_safe(board, row, col):
        for i in range(row):
            if board[i] == col or \
               board[i] - i == col - row or \
               board[i] + i == col + row:
                return False
        return True

    def backtrack(board, row):
        if row == n:
            solutions.append(board[:])
            return
        
        for col in range(n):
            if is_safe(board, row, col):
                board[row] = col
                backtrack(board, row + 1)  # Recursive call
                board[row] = -1  # Backtracking occurs here

    solutions = []
    board = [-1] * n
    backtrack(board, 0)
    return solutions

n = 4
solutions = solve_n_queens(n)
for sol in solutions:
    print(sol)