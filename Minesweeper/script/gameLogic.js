window.onload = function () {
    var rows = 10,
        cols = 10,
        fieldSize = 30,

        stageWidth = cols * fieldSize,
        stageHeight = rows * fieldSize,

        field = [],
        mine = 'X',
        emptyField = ' ',
        flagsCount = 10,
        flagsString = (flagsCount === 1) ? "You have " + flagsCount + " flag left" : "You have " + flagsCount + " flags left",

        windowWidth = window.innerWidth,
        windowHeight = window.innerHeight,

        stage = new Kinetic.Stage({
            container: 'container',
            width: stageWidth,
            height: stageHeight
        }),

        fieldLayer = new Kinetic.Layer(),
        minesLayer = new Kinetic.Layer(),
        allMineFiled,
        canvasContainer = document.getElementById('container');

    canvasContainer.style.left = Math.round((windowWidth - stageWidth) / 2) + 'px';
    canvasContainer.style.top = Math.round(windowHeight / 2) + 'px';

    // disable right click context menu over container DIV
    document.getElementById('container').oncontextmenu = new Function("return false");

    loadBackground();

    initGame();

    function initGame() {
        InitGrid();
        setMines();
        setMineNumbers(field); //filling numbers around mines
        drawInfoBoard();

        allMineFields = fieldLayer.get('.field');

        stage.add(fieldLayer);
        stage.add(minesLayer);
    }

    allMineFields.on('mousedown', function () {

        var x = this.getX() / fieldSize;
        var y = this.getY() / fieldSize;

        if (field[y][x] === ' ') {
            revealCell(x, y);
        }
        else if (field[y][x] === mine) {
            drawText(y, x, mine, 'red');
            alert('You died!');
            initGame();
        }
        else if (field[y][x] !== mine) {
            drawText(y, x, field[y][x], 'white');
        }

        this.fill('lightgray');
        this.draw();
    });

    allMineFields.on('mouseover', function () {
        this.stroke('white');
        this.draw();
    });

    allMineFields.on('mouseout', function () {
        this.stroke('black');
        this.draw();
    });

    function InitGrid() {

        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {

                var currentField = new Kinetic.Rect({
                    name: 'field',
                    x: col * fieldSize,
                    y: row * fieldSize,
                    width: fieldSize,
                    height: fieldSize,
                    fill: 'gray',
                    stroke: 'black'
                });

                fieldLayer.add(currentField);
            }
        }
    }

    function setMines() {
        // fill field with empty spaces
        for (var row = 0; row < rows; row++) {
            field[row] = [];
            for (var col = 0; col < cols; col++) {
                field[row][col] = emptyField;
            }
        }

        // fill with mines
        var mineNumber = Math.floor(Math.random() * 10) + 10; // setting difficulty (how many mines are there on the field)
        for (var i = 0; i < mineNumber; i++) {
            var x = Math.floor(Math.random() * rows),
                y = Math.floor(Math.random() * cols);

            field[x][y] = mine; // put mine at random position
        }
    }

    function setMineNumbers() {
        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {
                if (field[row][col] !== mine) {
                    field[row][col] = setCurrentCellNumber(row, col);
                }
            }
        }
    }

    function setCurrentCellNumber(currentRow, currentCol) {
        var countMines = 0;

        //count mines in adjacent fields
        for (var i = currentRow - 1; i <= currentRow + 1; i++) {
            if (i < 0 || i >= rows) {  // if outside the matrix
                continue;
            }

            for (var j = currentCol - 1; j <= currentCol + 1; j++) {
                if (j < 0 || j >= cols) { // if outside the matrix
                    continue;
                }

                if (field[i][j] === mine) {
                    countMines += 1;
                }
            }
        }

        if (countMines === 0) {
            return emptyField;
        }

        return countMines.toString();
    }

    function drawText(row, col, text, color) {
        var mine = new Kinetic.Text({
            x: col * fieldSize,
            y: row * fieldSize,
            text: text,
            fontSize: fieldSize,
            fontFamily: 'Consolas',
            width: fieldSize,
            heigth: fieldSize,
            align: 'center',
            fill: color
        });

        minesLayer.add(mine);
        mine.draw();
    }

    function revealCell(x, y) {
        if (isInBounds(x, y)) {
            var cellValue = field[y][x];
            if (field[y][x] === "n" || field[y][x] === mine) {

            }
            else if (field[y][x] === " ") {
                handleEmptyCell(x, y);
            }
            else {
                handleTextCell(x, y);
            }
        }
    }

    function revealNeighbouringEmptyCells(x, y) {
        revealCell(x - 1, y);
        revealCell(x + 1, y);
        revealCell(x, y + 1);
        revealCell(x, y - 1);
        revealCell(x - 1, y - 1);
        revealCell(x - 1, y + 1);
        revealCell(x + 1, y - 1);
        revealCell(x + 1, y + 1);
    };

    function isInBounds(x, y) {
        var isInside = false;
        if (x >= 0 && x < cols) {
            if (y >= 0 && y < rows) {
                isInside = true;
            }
        }
        return isInside;
    }

    function drawInfoBoard() {
        var paper = new Raphael(10, 10, 250, 450);
        paper.rect(10, 10, 250, 450).attr({
            stroke: 'darkgrey',
            fill: 'darkgrey'
        });
        paper.text(130, 30, flagsString).attr({
            stroke: 'black',
            'stroke-width': 2,
            'font-family': 'Consolas',
            'font-size': "18px",
        });

        paper.image('imgs/2000px-Red_flag_waving.svg_2.png', 100, 50, 100, 100).attr({
            opacity: 0.7
        });

        paper.text(140, 230, "And know this - \nif you fail, \nthe kitten DIES!").attr({
            stroke: 'black',
            'stroke-width': 2,
            'font-family': 'Consolas',
            'font-size': "18px",
        });

        paper.image('imgs/Cute_Kitten_Cartoon_Free_Clipart.png', 60, 280, 150, 150).attr({
            opacity: 0.7
        });
    }

    function handleEmptyCell(x, y) {
        drawText(y, x, ' ', 'lightgrey')
        field[y][x] = "n";
        revealNeighbouringEmptyCells(x, y);
    }

    function handleTextCell(x, y) {
        drawText(y, x, field[y][x], 'white');
    }
}
