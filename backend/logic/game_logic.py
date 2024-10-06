from typing import List

def is_valid_move(board: List[List[str]], row: int, col: int):
    """
    Check if the move are within the row and col
    
    """

    if 0 <= row <= 2 and 0 <= col <= 2 and board[row][col] == "":
        return True
    return False

def make_move(board: List[List[str]], row: int, col: int, player: str):
    """
    Make a move, update in the board

    """
    if is_valid_move(board, row, col):
        board[row][col] = player
        return board
    else:
        return None

def check_winner(board: List[List[str]]):
    """
    Check for winner, by rows, colums or diagonals

    """
    
    for row in board: # Check rows
        if row[0] == row[1] == row[2] and row[0] != "":
            return row[0]
    
    for col in range(3): # Check columns
        if board[0][col] == board[1][col] == board[2][col] and board[0][col] != "":
            return board[0][col]
    
    if (board[0][0] == board[1][1] == board[2][2] or
            board[0][2] == board[1][1] == board[2][0]) and board[1][1] != "": # Check diagonals
        return board[1][1]
    return None

def check_draw(board: List[List[str]]):
    """
    Check for draw, for loop in board list, check any None value

    """
    for row in board:
        for cell in row:
            if cell == "":
                return False
    return True