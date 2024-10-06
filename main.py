from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.models import Game, Move
from backend.db.database import (
    create_game_db,
    get_game_db,
    update_game_db,
)
from backend.logic.game_logic import (
    is_valid_move,
    make_move as make_moves,
    check_winner,
    check_draw,
)
import uuid

app = FastAPI()

# Mount the 'frontend' directory as the root for static files
app.mount("/files", StaticFiles(directory="frontend", html=True), name="static")


@app.post("/create_game", response_model=Game)
async def create_game():
    """
    Creates a new game 😁
    
    """
    game_id = str(uuid.uuid4()) # Generates a unique game ID
    game = Game(
        game_id=game_id,
        player1="X",
        board=[['' for _ in range(3)] for _ in range(3)],
        current_player="X",
        status="in_progress",
    )
    await create_game_db(game)
    return game


@app.put("/invite_player/{game_id}", response_model=Game)
async def invite_player(game_id: str):
    """
    Invite the 2nd player, to the existing game
    
    """
    game = await get_game_db(game_id)
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    if game.player2 is not None:
        raise HTTPException(status_code=400, detail="Player 2 already invited")

    game.player2 = 'O'
    success = await update_game_db(game)
    if success:
        return game
    else:
        raise HTTPException(status_code=500, detail="Failed to invite player")


@app.put("/make_move/{game_id}", response_model=Game)
async def make_move(game_id: str, move: Move):
    """
    Makes a move in the game
    
    """
    player = move.player
    row = move.row
    col = move.col

    game = await get_game_db(game_id)
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    if game.status != "in_progress":
        raise HTTPException(status_code=400, detail="Game is not in progress")
    if game.current_player != player:
        raise HTTPException(status_code=400, detail="It's not your turn")

    if not is_valid_move(game.board, row, col):
        raise HTTPException(status_code=400, detail="Invalid move")

    game.board = make_moves(game.board, row, col, player)

    winner = check_winner(game.board)
    if winner:
        game.winner = winner
        game.status = "completed"
    elif check_draw(game.board):
        game.status = "draw"
    else:
        # Switch to the other player
        game.current_player = (
            game.player1 if game.current_player == game.player2 else game.player2
        )

    success = await update_game_db(game)
    if success:
        return game
    else:
        raise HTTPException(status_code=500, detail="Failed to update game")


@app.get("/game_status/{game_id}", response_model=Game)
async def game_status(game_id: str):
    """
    Retrieves the current status of a game
    
    """
    game = await get_game_db(game_id)
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    return game


if __name__ == "__main__":
    import uvicorn

    # --

    # Debug and developer modes enabled
    reload=True

    # --
    
    uvicorn.run("main:app", host="0.0.0.0", port=8009, reload=reload)