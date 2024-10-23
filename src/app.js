import readlineSync from "readline-sync";

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

    const printBoard = () => {
        const boardWithCellValues = board
            .map((row) => row.map((cell) => cell.getValue()))
            .join("\n");
        console.log(boardWithCellValues);
    };

    return { getBoard, setToken, printBoard };
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

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

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

    const playRound = (coordinates) => {
        const { x, y } = coordinates;
        if (!isCorrectRound(x, y)) {
            console.log(
                `${
                    getActivePlayer().name
                } set the token by coordinates ${x} and ${y}`
            );
            board.setToken(coordinates, getActivePlayer().token);
            countSteps += 1;
        } else {
            console.log(`Set the value to an empty cell!`);
            return;
        }
        if (isVictory()) {
            console.log(`${getActivePlayer().name} is the winner!`);
            board.printBoard();
            return true;
        }
        if (countSteps === 9) {
            console.log(`It's a draw!`);
            board.printBoard();
            return true;
        }
        switchPlayerTurn();
        printNewRound();
        return false;
    };

    printNewRound();

    return {
        playRound,
    };
}

function ScreenController() {}

function clickHandlerBoard(evt) {}

function runGame() {
    const { playRound } = GameController();
    while (true) {
        const indexX = readlineSync.question("Choose the X coordinate! ");
        const indexY = readlineSync.question("Choose the Y coordinate! ");
        const isGameOver = playRound({ x: Number(indexX), y: Number(indexY) });
        if (isGameOver) {
            console.log("Game over!");
            return;
        }
    }
}

runGame();
