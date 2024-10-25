function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    const hashIdBoard = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
    ];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell(i, j, hashIdBoard[i][j]));
        }
    }

    const getBoard = () => board;

    const setToken = ({ x, y }, token) => {
        if (board[x][y].getValue() !== "-") return;

        board[x][y].addToken(token);
    };

    return { getBoard, setToken };
}

function Cell(x, y, hashId) {
    let value = "-";

    const addToken = (token) => {
        value = token;
    };

    const getValue = () => value;

    const getCoordinates = () => {
        return { x, y };
    };

    const getHashId = () => {
        return hashId;
    };

    return {
        addToken,
        getValue,
        getCoordinates,
        getHashId,
    };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();
    let countSteps = 0;
    const players = [
        {
            name: playerOneName,
            token: "X",
        },
        {
            name: playerTwoName,
            token: "0",
        },
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const isVictory = () => {
        const combs = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let comb of combs) {
            const currentBoardLine = comb.map((item) => {
                const [currentCell] = board
                    .getBoard()
                    .flat()
                    .filter((cell) => item === cell.getHashId());
                return currentCell;
            });
            const currentBoardLineTokens = currentBoardLine
                .map((cell) => cell.getValue())
                .join("");
            if (
                currentBoardLineTokens === "XXX" ||
                currentBoardLineTokens === "000"
            )
                return true;
        }

        return false;
    };

    const isCorrectRound = (x, y) => {
        const value = board.getBoard()[x][y].getValue();
        return value === "X" || value === "0";
    };

    const playRound = (coordinates, updateField) => {
        const { x, y } = coordinates;
        if (!isCorrectRound(x, y)) {
            updateStatusGame(
                `${
                    getActivePlayer().name
                } set the token by coordinates ${x} and ${y}`
            );
            board.setToken(coordinates, getActivePlayer().token);
            updateField(x, y, getActivePlayer().token);
            countSteps += 1;
        } else {
            updateStatusGame("Set the value to an empty cell!");
            return;
        }
        if (isVictory()) {
            updateStatusGame(`${getActivePlayer().name} is the winner!`);
            return true;
        }
        if (countSteps === 9) {
            updateStatusGame(`It's a draw!`);
            return true;
        }
        switchPlayerTurn();
        updateTurnStatus(`${getActivePlayer().name}'s turn.`);
        return false;
    };

    return {
        playRound,
    };
}

function updateStatusGame(text = "") {
    const statusGame = document.getElementById("status-game");
    statusGame.innerHTML = text;
}

function updateTurnStatus(text = "") {
    const statusTurn = document.getElementById("status-turn");
    statusTurn.innerHTML = text;
}

function clickHandlerBoard(evt, playRound, updateField) {
    const { currentTarget } = evt;
    const { x, y } = currentTarget.dataset;
    const isGameOver = playRound({ x: Number(x), y: Number(y) }, updateField);
    if (isGameOver) {
        updateStatusGame("Game over!");
        return;
    }
}

function ScreenController(playRound) {
    const gameBoard = document.getElementById("game-board");
    const fields = [...gameBoard.querySelectorAll(".field")];

    const updateField = (x, y, token) => {
        const currentField = fields.find(
            (el) => el.dataset.x === x && el.dataset.y === y
        );
        const currentSpan = currentField.querySelector("span");
        currentSpan.innerText = token;
    };

    fields.forEach((field) => {
        field.addEventListener("click", (evt) =>
            clickHandlerBoard(evt, playRound, updateField)
        );
    });
}

function runGame() {
    const { playRound } = GameController();
    ScreenController(playRound);
}

runGame();
