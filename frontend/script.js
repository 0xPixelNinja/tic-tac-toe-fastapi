const gameBoard = document.getElementById('game-board');
let gameId = null;
let currentPlayer = 'X'; // Keep track of the current player

// Function to create a new game
async function createGame() {
    const response = await fetch('/create_game', { method: 'POST' });
    const game = await response.json();
    gameId = game.game_id;
    currentPlayer = game.current_player;
    updateBoard(game.board);
}

async function invitePlayer() {
    const gameIdx = prompt("Enter the Game ID to invite a player:");

    if (!gameIdx) {
        alert("Please enter both Game ID and Player 2 name.");
        return;
    }

    try {
        const response = await fetch(`/invite_player/${gameIdx}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'player2': 'O' })
        });

        if (response.ok) {
            const game = await response.json();
            // Optionally update the UI to reflect the invitation
            alert(`Player O invited to game ${gameIdx}`);
            gameId = game.game_id;
            updateBoard(game.board);
        } else {
            const errorData = await response.json();
            alert(`Error inviting player: ${errorData.detail}`);
        }
    } catch (error) {
        alert(`Error inviting player: ${error}`);
    }
}


// Function to make a move
async function makeMove(row, col) {
    if (!gameId) {
        alert('Please create a game first.');
        return;
    }

    try {
        const response = await fetch(`/make_move/${gameId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player: currentPlayer, row: row, col: col })
        });

        if (response.ok) {
            const game = await response.json();
            currentPlayer = game.current_player; // Update current player
            updateBoard(game.board);
        } else {
            const errorData = await response.json();
            alert(`Error making move: ${errorData.detail}`);
        }
    } catch (error) {
        alert(`Error making move: ${error}`);
    }
}

// Function to update the game board display
function updateBoard(board) {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = board[i][j];
            cell.addEventListener('click', () => makeMove(i, j));
            gameBoard.appendChild(cell);
        }
    }
}

// Function to update the game status automatically
async function updateGameStatus() {
    if (!gameId) {
        return; // No game created yet
    }

    try {
        const response = await fetch(`/game_status/${gameId}`);
        if (response.ok) {
            const game = await response.json();
            currentPlayer = game.current_player;
            updateBoard(game.board);

            // Check for game over
            if (game.status === 'completed') {
                alert(`Player ${game.winner} wins!`);
            } else if (game.status === 'draw') {
                alert("It's a draw!");
            }
        } else {
            // Handle error (e.g., game not found)
        }
    } catch (error) {
        console.error('Error updating game status:', error);
    }
}

// Update game status every 3 seconds
setInterval(updateGameStatus, 3000);