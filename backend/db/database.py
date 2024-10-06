from motor.motor_asyncio import AsyncIOMotorClient
from backend.models import Game
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')

client = AsyncIOMotorClient(MONGO_URI)
database = client.GamesDB
games_collection = database.get_collection("tictactoe_game")

async def create_game_db(game: Game):
    """
    Create GameDB
    
    """
    try:
        result = await games_collection.insert_one(game.model_dump())
        return result.inserted_id
    except Exception as e:
        print(f"Error creating game in database: {e}")
        return None


async def get_game_db(game_id: str):
    """
    Retrieve GameDB
    
    """
    try:
        game = await games_collection.find_one({"game_id": game_id})
        if game:
            return Game(**game)
        else:
            return None
    except Exception as e:
        print(f"Error retrieving game from database: {e}")
        return None


async def update_game_db(game: Game):
    """
    Updating GameDB

    """
    try:
        result = await games_collection.update_one(
            {"game_id": game.game_id}, {"$set": game.model_dump()}
        )
        if result.modified_count == 1:
            return True
        else:
            return False
    except Exception as e:
        print(f"Error updating game in database: {e}")
        return False