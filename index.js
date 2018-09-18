// Let's convert to ES6.
document.addEventListener('DOMContentLoaded', (e) => {
  const playButton = document.getElementById('resetBoard');

  // Score counter.
  let xWon = 0;
  let oWon = 0;

  playButton.addEventListener('click', () => {
    const boardSize = parseInt(document.getElementById('boardSize').value);

    // because 2x2 is not challenging enough.
    if (isNaN(boardSize) || boardSize < 3) {
      alert('Try enter 3 or more in the board size.');
      return false;
    }

    const totalBlocks = Math.pow(boardSize, 2);
    const board = document.getElementById('board');
    const xWonCountLabel = document.getElementById('xWonCount');
    const oWonCountLabel = document.getElementById('oWonCount');

    // Reset game.
    // gameState to store point after each click.
    // e.g. 3x3 board size with have a gameState of [row1, row2, row3, col1, col2, col3, diag1, diag2]
    const gameState = new Array(boardSize * 2 + 2);
    gameState.fill(0);
    let playerTurnIndicator = 0; // to indicate whose turn, even for X, odd for O.
    let shouldRestart = false; // to indicate game should restart.

    // Let's build the board.
    board.style.width = boardSize * 100 + 'px';
    board.innerHTML = '';
    let row = 0; // used for data-row value to indicate which row this block belongs to.
    let column = 0; // used for data-column value to indicate which column this block belongs to.
    for (let i = 1; i <= totalBlocks; i++) {
      if (column >= boardSize) column = 0;

      if (boardSize % 2 === 0) {
        // alternate the dark & light class on block for styling
        // only if boardSize is even size.
        const isEvenRow = Math.ceil(i / boardSize) % 2 == 0;
        const alternateBlock = i % 2 == isEvenRow;
        board.innerHTML += (alternateBlock)
          ? "<div data-row='"+ row +"' data-column='"+ column +"' class='block dark'></div>"
          : "<div data-row='"+ row +"' data-column='"+ column +"' class='block light'></div>";
      } else {
        const blockStyle = (i % 2 === 0) ? 'dark' : 'light';
        board.innerHTML += "<div data-row='"+ row +"' data-column='"+ column +"' class='block "+ blockStyle +"'></div>";
      }

      column++;
      if (i % boardSize === 0) row += 1;
    }

    const blocks = document.getElementsByClassName('block');

    // Attach click handler to each block.
    for (let j = 0; j < blocks.length; j++) {
      blocks[j].addEventListener('click', function () {
        if (shouldRestart) {
          const answer = confirm('This game is over, do you want to play again?');
          if (answer) {
            return playButton.click();
          } else {
            return false
          }
        }

        if (this.innerHTML !== '') { // Means this block is taken.
          alert('Nahh, click other block please!');
          return false;
        } else {
          const row = parseInt(this.dataset.row); // get value from data-row
          const column = parseInt(this.dataset.column); // get value from data-column
          if (playerTurnIndicator % 2 === 0) {
            this.classList.add('isX');
            this.innerHTML = 'X';
            checkWinner('x', row, column);
          } else {
            this.classList.add('isO');
            this.innerHTML = 'O';
            checkWinner('o', row, column);
          }

          playerTurnIndicator++;
        }
      })
    }

    const checkWinner = (player, row, column) => {
      // point 1 for player X, point -1 for player O.
      let point = (player === 'x') ? 1 : -1;

      // add point to row
      gameState[row] += point;

      // add point to column
      gameState[boardSize + column] += point;

      // add point to diag1
      if (row === column) {
        gameState[2 * boardSize] += point;
      }

      // add point to diag2
      if (row + column === boardSize - 1) {
        gameState [2 * boardSize + 1] += point;
      }

      const xWins = gameState.indexOf(boardSize);
      const oWins = gameState.indexOf(-boardSize);

      if (xWins >= 0) {
        shouldRestart = true;
        xWon += 1;
        xWonCountLabel.value = xWon;
        alert('X has won!');
        return true;
      } else if (oWins >= 0) {
        shouldRestart = true;
        oWon += 1;
        oWonCountLabel.value = oWon;
        alert('O has won!');
        return true;
      }

      // Means no more block to click and winner has not been found,
      // so it's a draw.
      if (playerTurnIndicator === totalBlocks - 1) {
        shouldRestart = true;
        alert("It's a draw!");
        return false;
      }
    }
  });
});