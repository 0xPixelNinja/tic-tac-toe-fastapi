const gameBoard = document.getElementById('game-board');
let gameId = null;
let currentPlayer = ''; // Keep track of the current player

async function createGame() {
    const response = await fetch('/api/create_game', { method: 'POST' });
    const game = await response.json();
    gameId = game.game_id;
    currentPlayer = 'X'
    updateBoard(game.board);
}

async function invitePlayer() {
    const gameIdx = prompt("Enter the Game ID to invite a player:");

    if (!gameIdx) {
        alert("Please enter both Game ID and Player 2 name.");
        return;
    }

    try {
        const response = await fetch(`/api/invite_player/${gameIdx}`, {
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
            currentPlayer = 'O';
            updateBoard(game.board);
        } else {
            const errorData = await response.json();
            alert(`Error inviting player: ${errorData.detail}`);
        }
    } catch (error) {
        alert(`Error inviting player: ${error}`);
    }
}

async function makeMove(row, col) {
    if (!gameId) {
        alert('Please create a game first.');
        return;
    }

    try {
        const response = await fetch(`/api/make_move/${gameId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player: currentPlayer, row: row, col: col })
        });

        if (response.ok) {
            const game = await response.json();
            updateBoard(game.board);
        } else {
            const errorData = await response.json();
            alert(`Error making move: ${errorData.detail}`);
        }
    } catch (error) {
        alert(`Error making move: ${error}`);
    }
}

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

async function copyGameID() {
    if (!gameId) {
        alert('Please create a game first.');
        return;
    }

    try {
        await navigator.clipboard.writeText(gameId);
        alert('Game ID copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy game ID: ', err);
        // Fallback to older method if clipboard API fails
        const tempInput = document.createElement('input');
        tempInput.value = gameId;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.commandId('copy');
        document.body.removeChild(tempInput);
        alert('Game ID copied to clipboard!');
    }
}

async function updateGameStatus() {
    if (!gameId) {
        return; // No game created yet
    }

    try {
        const response = await fetch(`/api/game_status/${gameId}`);
        if (response.ok) {
            const game = await response.json();
            updateBoard(game.board);

            // Check for game over
            if (game.status === 'completed') {
                alert(`Player ${game.winner} wins!`);
                clearInterval(intervalId); // Stop the interval
            } else if (game.status === 'draw') {
                alert("It's a draw!");
                clearInterval(intervalId); // Stop the interval
            }
        } else {
        }
    } catch (error) {
        console.error('Error updating game status:', error);
    }
}

let intervalId = setInterval(updateGameStatus, 3000);