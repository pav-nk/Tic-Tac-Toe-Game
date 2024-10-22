import readlineSync from "readline-sync";

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell(i, j));
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

function Cell(x, y) {
    let value = "-";

    const addToken = (token) => {
        value = token;
    };

    const getValue = () => value;

    const getCoordinates = () => {
        return { x, y };
    };

    return {
        addToken,
        getValue,
        getCoordinates,
    };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();

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

    const playRound = (coordinates) => {
        console.log(
            `${getActivePlayer().name} set the token by coordinates ${
                coordinates.x
            } and ${coordinates.y}`
        );
        board.setToken(coordinates, getActivePlayer().token);

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
    };
}

function ScreenController() {}

function clickHandlerBoard(evt) {}

function runGame() {
    const board = Gameboard();
    const { playRound } = GameController();
    while (true) {
        const indexX = readlineSync.question("Choose the X coordinate!");
        const indexY = readlineSync.question("Choose the Y coordinate!");
        playRound({ x: Number(indexX) - 1, y: Number(indexY) - 1 });
    }
}

runGame();
