# Tic-tac-toe-fastapi
Tic-Tac-Toe game with focus on the back-end development using FastAPI and MongoDB. The RESTful API provides endpoints for game create, player invites, move processing, and game status.

* **Create a new game:** Start a fresh game and get a unique Game ID.
* **Invite a friend:** Share your Game ID with a friend to play against them.
* **Make moves:** Take turns placing your X or O on the board.
* **Real-time updates:** See the game board update instantly after each move (game boards update every 3 second).
* **Game status:** Get notified when the game is over and who the winner is (or if it's a draw).

## How to Play

1. **Create a game:** Click the "Create Game" button to start a new game.
2. **Invite a friend:** Copy the generated Game ID and share it with your friend.
3. **Join the game:** Your friend can join the game using the provided Game ID.
4. **Take turns:** Click on an empty cell to place your symbol (X or O).
5. **Win or Draw:** The first player to get three of their symbols in a row (horizontally, vertically, or diagonally) wins the game. If all cells are filled and no one has won, it's a draw.

## API Endpoints

The game interacts with the backend API with the following endpoints:

* **POST /create_game:** Creates a new game and returns the game ID and initial board status.
* **PUT /invite_player/{game_id}:** Adds a second player to an existing game.
* **PUT /make_move/{game_id}:** Updates the game board with a player's move.
* **GET /game_status/{game_id}:** Retrieves the current status and board state of a game.

## TODO List

* **AI opponent:** Implement an AI opponent to play against.
* **Leaderboard:** Add a leaderboard to track player scores.
* **Improved design:** Enhance the visual design with animations and more interactive elements (idk, someone help).
* **User authentication:** Allow users to create accounts and track their game history.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for bug fixes, feature enhancements, or design improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.