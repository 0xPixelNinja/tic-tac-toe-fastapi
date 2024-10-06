from pydantic import BaseModel
from typing import List

class Game(BaseModel):
    game_id: str
    player1: str
    player2: str | None = None
    board: List[List[str]]
    current_player: str | None = None
    status: str
    winner: str | None = None

class Move(BaseModel):
    player: str
    row: int
    col: int