window.onload = function () {
    var stageWidth = 300,
        stageHeight = 300,
        fieldSize = stageWidth / 10, // gives us scalable field ( when we change the stageWidth and stageHight the game scales correctly )
        rows = stageHeight / fieldSize,
        cols = stageWidth / fieldSize,

        field = [],
        mine = 'X',
        emptyField = ' ',

        stage = new Kinetic.Stage({
            container: 'container',
            width: stageWidth,
            height: stageHeight
        }),
        fieldLayer = new Kinetic.Layer(),
        minesLayer = new Kinetic.Layer(),
        allMineFiled;

    // disable right click context menu over container DIV
    document.getElementById('container').oncontextmenu = new Function("return false")

    initGame();

    function initGame() {
        InitGrid();
        setMines();
        setMineNumbers(field); //filling numbers around mines

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
                y = Math.floor(Math.random() * rows);

            field[y][x] = mine; // put mine at random position
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
                drawText(y, x, 'n', 'red')
                field[y][x] = "n";
                revealNeighbouringEmptyCells(x, y);
            }
            else {
                drawText(y, x, field[y][x], 'white');
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


}
