import { useState } from 'react';

const UP = 0; // create constants for easier reading
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

function Square({ value }) { // generate square object, taken from tic tac toe tutorial
    return <button className="square">{value}</button>;
}

function Pair(x, y) {
  this.x = x;
  this.y = y;
}

function getRandomOpenSquare(squares) { // get a random open square to add the new value
  let openSquares = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (squares[i][j] == null) {
        openSquares.push(new Pair(i, j));
      }
    }
  }
  let p = openSquares[Math.floor(Math.random() * openSquares.length)]
  if (p != null) {
    return [p.x, p.y]; 
  }
  else {
    return [null, null]; 
  }
}

function newValue() { // return either a 2 (90% of the time) or 4 (10% of the time), to be added when you move
  if (Math.floor(Math.random() * 10) == 0) {
    return 4;
  }
  else {
    return 2;
  }
}

function move(squares, direction) { // return the new squares to move to
  let nextSquares = Array.from({length: 4},()=> Array.from({length: 4}, () => null));
  let merged = Array.from({length: 4},()=> Array.from({length: 4}, () => false));
  let moved = false;

  if (direction == UP) { // for up, it needs to count rows forward for the priority
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (squares[i][j] != null) {
          let x = newPosition(nextSquares, squares, merged, i, j, direction);
          if (x != null) {
            nextSquares[x][j] = squares[i][j];
            if (x != i) {
              console.log("movedup");
              moved = true; // track whether or not the tiles moved
            }
          }
        }
      }
    }
  }
  else if (direction == DOWN) { // for down, it needs to count rows backward for the priority
    for (let i = 3; i >= 0; i--) {
      for (let j = 0; j < 4; j++) {
        if (squares[i][j] != null) {
          let x = newPosition(nextSquares, squares, merged, i, j, direction);
          if (x != null) {
            nextSquares[x][j] = squares[i][j];
            if (x != i) {
              console.log("moveddown");
              moved = true;
            }
          }
        }
      }
    }
  }
  else if (direction == LEFT) { // for left, it needs to count columns forward for the priority
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        if (squares[i][j] != null) {
          let y = newPosition(nextSquares, squares, merged, i, j, direction);
          if (y != null) {
            nextSquares[i][y] = squares[i][j];
            if (y != j) {
              console.log("movedleft");
              moved = true;
            }
          }
        }
      }
    }
  }
  else if (direction == RIGHT) { // for right, it needs to count columns backward for the priority
    for (let j = 3; j >= 0; j--) {
      for (let i = 0; i < 4; i++) {
        if (squares[i][j] != null) {
          let y = newPosition(nextSquares, squares, merged, i, j, direction);
          if (y != null) {
            nextSquares[i][y] = squares[i][j];
            if (y != j) {
              console.log("movedright");
              moved = true;
            }
          }
        }
      }
    }
  }
  if (moved) {
    return nextSquares;
  }
  else {
    return null;
  }
}

function newPosition(nextSquares, squares, merged, i, j, direction) { // return new position of square
  if (direction == UP) { // up priority { {0, 0}, {0, 1}, {0, 2}, {0, 3} }, { {1, 0}, {1, 1}, {1, 2}, {1, 3} }, { {2, 0}, {2, 1}, {2, 2}, {2, 3} }, { {3, 0}, {3, 1}, {3, 2}, {3, 3} }
    if (i == 0) { // if i, j is top row, it does not move
      return i;
    }
    if (i == 1) { // check the next row
      if (nextSquares[i - 1][j] == null) { // if the higher square is null, it moves there
        return i - 1; // j stays the same so just return the new i value
      }
      else { // otherwise, it does not move unless the top square matches and hasn't been merged yet
        if (nextSquares[i - 1][j] == squares[i][j] && !merged[i - 1][j]) {
          squares[i][j] = squares[i][j] * 2; // update value 
          merged[i - 1][j] = true;
          return i - 1;
        }
        return i;
      }
    }
    if (i == 2) { // check the next row 
      if (nextSquares[i - 2][j] == null) { // if the highest square is null, it moves there
        return i - 2;
      }
      if (nextSquares[i - 1][j] == null) { // if the next highest square is null, it moves there or merges if not already merged
        if (nextSquares[i - 2][j] == squares[i][j] && !merged[i - 2][j]) {
          squares[i][j] = squares[i][j] * 2;
          merged[i - 2][j] = true;
          return i - 2;
        }
        return i - 1;
      }
      else { // otherwise, it checks for merge, if not possible then it doesn't move
        if (nextSquares[i - 1][j] == squares[i][j] && !merged[i - 1][j]) {
          squares[i][j] = squares[i][j] * 2;
          merged[i - 1][j] = true;
          return i - 1;
        }
        return i;
      }
    }
    if (i == 3) { // check the next row 
      if (nextSquares[i - 3][j] == null) { // if the highest square is null, it moves there
        return i - 3;
      }
      if (nextSquares[i - 2][j] == null) { // if the next highest square is null, it moves there or merges if not already merged
        if (nextSquares[i - 3][j] == squares[i][j] && !merged[i - 3][j]) {
          squares[i][j] = squares[i][j] * 2;
          merged[i - 3][j] = true;
          return i - 3;
        }
        return i - 2;
      }
      if (nextSquares[i - 1][j] == null) { // if the next highest square is null, it moves there or merges if not already merged
        if (nextSquares[i - 2][j] == squares[i][j] && !merged[i - 2][j]) {
          squares[i][j] = squares[i][j] * 2;
          merged[i - 2][j] = true;
          return i - 2;
        }
        return i - 1;
      }
      else { // otherwise, it checks for merge, if not possible then it doesn't move
        if (nextSquares[i - 1][j] == squares[i][j] && !merged[i - 1][j]) {
          squares[i][j] = squares[i][j] * 2;
          merged[i - 1][j] = true;
          return i - 1;
        }
        return i;
      }
    }
  }
  else if (direction == DOWN) { // down priority { {3, 0}, {3, 1}, {3, 2}, {3, 3} }, { {2, 0}, {2, 1}, {2, 2}, {2, 3} }, { {1, 0}, {1, 1}, {1, 2}, {1, 3} }, { {0, 0}, {0, 1}, {0, 2}, {0, 3} }
    if (i == 3) { // if i, j is bottom row, it does not move
      return i;
    }
    if (i == 2) { // check the next higher row
      if (nextSquares[i + 1][j] == null) { // if the lower square is null, it moves there
        return i + 1; // j stays the same so just return the new i value
      }
      else { // otherwise, it does not move unless the bottom square matches and hasn't been merged yet
        if (nextSquares[i + 1][j] == squares[i][j] && !merged[i + 1][j]) {
          squares[i][j] = squares[i][j] * 2; // update value 
          merged[i + 1][j] = true;
          return i + 1;
        }
        return i;
      }
    }
    if (i == 1) { // check the next higher row 
      if (nextSquares[i + 2][j] == null) { // if the lowest square is null, it moves there
        return i + 2;
      }
      if (nextSquares[i + 1][j] == null) { // if the next lowest square is null, it moves there or merges if not already merged
        if (nextSquares[i + 2][j] == squares[i][j] && !merged[i + 2][j]) {
          squares[i][j] = squares[i][j] * 2;
          merged[i + 2][j] = true;
          return i + 2;
        }
        return i + 1;
      }
      else { // otherwise, it checks for merge, if not possible then it doesn't move
        if (nextSquares[i + 1][j] == squares[i][j] && !merged[i + 1][j]) {
          squares[i][j] = squares[i][j] * 2;
          merged[i + 1][j] = true;
          return i + 1;
        }
        return i;
      }
    }
    if (i == 0) { // check the next row 
      if (nextSquares[i + 3][j] == null) { // if the lowest square is null, it moves there
        return i + 3;
      }
      if (nextSquares[i + 2][j] == null) { // if the next lowest square is null, it moves there
        if (nextSquares[i + 3][j] == squares[i][j] && !merged[i + 3][j]) {
          squares[i][j] = squares[i][j] * 2;
          merged[i + 3][j] = true;
          return i + 3;
        }
        return i + 2;
      }
      if (nextSquares[i + 1][j] == null) { // if the next lowest square is null, it moves there
        if (nextSquares[i + 2][j] == squares[i][j] && !merged[i + 2][j]) {
          squares[i][j] = squares[i][j] * 2;
          merged[i + 2][j] = true;
          return i + 2;
        }
        return i + 1;
      }
      else { // otherwise, it checks for merge, if not possible then it doesn't move
        if (nextSquares[i + 1][j] == squares[i][j] && !merged[i + 1][j]) {
          squares[i][j] = squares[i][j] * 2;
          merged[i + 1][j] = true;
          return i + 1;
        }
        return i;
      }
    }
  }
  else if (direction == LEFT) { // left priority { {0, 0}, {1, 0}, {2, 0}, {3, 0} }, { {0, 1}, {1, 1}, {2, 1}, {3, 1} }, { {0, 2}, {1, 2}, {2, 2}, {3, 2} }, { {0, 3}, {1, 3}, {2, 3}, {3, 3} }
    if (j == 0) { // if i, j is leftmost column, it does not move
      return j;
    }
    if (j == 1) { // check the next column
      if (nextSquares[i][j - 1] == null) { // if the square is null, it moves there
        return j - 1; // i stays the same so just return the new j value
      }
      else { // otherwise, it does not move unless the left square matches and hasn't been merged yet
        if (nextSquares[i][j - 1] == squares[i][j] && !merged[i][j - 1]) {
          squares[i][j] = squares[i][j] * 2; // update value 
          merged[i][j - 1] = true;
          return j - 1;
        }
        return j;
      }
    }
    if (j == 2) { // check the next column
      if (nextSquares[i][j - 2] == null) { // if the leftmost square is null, it moves there
        return j - 2;
      }
      if (nextSquares[i][j - 1] == null) { // if the next square is null, it moves there or merges if not already merged
        if (nextSquares[i][j - 2] == squares[i][j] && !merged[i][j - 2]) {
          squares[i][j] = squares[i][j] * 2; // update value 
          merged[i][j - 2] = true;
          return j - 2;
        }
        return j - 1;
      }
      else { // otherwise, it checks for merge, if not possible then it doesn't move
        if (nextSquares[i][j - 1] == squares[i][j] && !merged[i][j - 1]) {
          squares[i][j] = squares[i][j] * 2; // update value 
          merged[i][j - 1] = true;
          return j - 1;
        }
        return j;
      }
    }
    if (j == 3) { // check the next row 
      if (nextSquares[i][j - 3] == null) { // if the leftmost square is null, it moves there
        return j - 3;
      }
      if (nextSquares[i][j - 2] == null) { // if the next square is null, it moves there or merges if not already merged
        if (nextSquares[i][j - 3] == squares[i][j] && !merged[i][j - 3]) {
          squares[i][j] = squares[i][j] * 2; // update value 
          merged[i][j - 3] = true;
          return j - 3;
        }
        return j - 2;
      }
      if (nextSquares[i][j - 1] == null) { // if the next square is null, it moves there or merges if not already merged
        if (nextSquares[i][j - 2] == squares[i][j] && !merged[i][j - 2]) {
          squares[i][j] = squares[i][j] * 2; // update value 
          merged[i][j - 2] = true;
          return j - 2;
        }
        return j - 1;
      }
      else { // otherwise, it checks for merge, if not possible then it doesn't move
        if (nextSquares[i][j - 1] == squares[i][j] && !merged[i][j - 1]) {
          squares[i][j] = squares[i][j] * 2; // update value 
          merged[i][j - 1] = true;
          return j - 1;
        }
        return j;
      }
    }
  }
  else if (direction == RIGHT) { // right priority { {0, 3}, {1, 3}, {2, 3}, {3, 3} }, { {0, 2}, {1, 2}, {2, 2}, {3, 2} }, { {0, 1}, {1, 1}, {2, 1}, {3, 1} }, { {0, 0}, {1, 0}, {2, 0}, {3, 0} }
    if (j == 3) { // if i, j is rightmost column, it does not move
      return j;
    }
    if (j == 2) { // check the next column
      if (nextSquares[i][j + 1] == null) { // if the square is null, it moves there
        return j + 1; // i stays the same so just return the new j value
      }
      else { // otherwise, it does not move unless the right square matches and hasn't been merged yet
        if (nextSquares[i][j + 1] == squares[i][j] && !merged[i][j + 1]) {
          squares[i][j] = squares[i][j] * 2; // update value 
          merged[i][j + 1] = true;
          return j + 1;
        }
        return j;
      }
    }
    if (j == 1) { // check the next column
      if (nextSquares[i][j + 2] == null) { // if the rightmost square is null, it moves there
        return j + 2;
      }
      if (nextSquares[i][j + 1] == null) { // if the next square is null, it moves there or merges if not already merged
        if (nextSquares[i][j + 2] == squares[i][j] && !merged[i][j + 2]) {
          squares[i][j] = squares[i][j] * 2; // update value 
          merged[i][j + 2] = true;
          return j + 2;
        }
        return j + 1;
      }
      else { // otherwise, it checks for merge, if not possible then it doesn't move
        if (nextSquares[i][j + 1] == squares[i][j] && !merged[i][j + 1]) {
          squares[i][j] = squares[i][j] * 2; // update value 
          merged[i][j + 1] = true;
          return j + 1;
        }
        return j;
      }
    }
    if (j == 0) { // check the next row 
      if (nextSquares[i][j + 3] == null) { // if the rightmost square is null, it moves there
        return j + 3;
      }
      if (nextSquares[i][j + 2] == null) { // if the next square is null, it moves there or merges if not already merged
        if (nextSquares[i][j + 3] == squares[i][j] && !merged[i][j + 3]) {
          squares[i][j] = squares[i][j] * 2; // update value 
          merged[i][j + 3] = true;
          return j + 3;
        }
        return j + 2;
      }
      if (nextSquares[i][j + 1] == null) { // if the next square is null, it moves there or merges if not already merged
        if (nextSquares[i][j + 2] == squares[i][j] && !merged[i][j + 2]) {
          squares[i][j] = squares[i][j] * 2; // update value 
          merged[i][j + 2] = true;
          return j + 2;
        }
        return j + 1;
      }
      else { // otherwise, it checks for merge, if not possible then it doesn't move 
        if (nextSquares[i][j + 1] == squares[i][j] && !merged[i][j + 1]) {
          squares[i][j] = squares[i][j] * 2; // update value 
          merged[i][j + 1] = true;
          return j + 1;
        }
        return j;
      }
    }
  }
  return null;
}

function checkStatus(squares) {
  console.log("in check status");
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      console.log(squares[i][j], i, j);
      if (squares[i][j] >= 2048) {
        return true;
      }
    }
  }
  console.log("out of check status");
  return false; // keep playing, no win yet
}

export default function Board() { // board inspired by tic tac toe tutorial
  const [squares, setSquares] = useState(Array.from({length: 4},()=> Array.from({length: 4}, () => null)));
  const [start, setStart] = useState(true);
    if (start) { // generate the starting square randomly as either 2 or 4
      const beginningSquares = squares.slice();
      const [i, j] = getRandomOpenSquare(squares);
      beginningSquares[i][j] = newValue();
      setSquares(beginningSquares);
      setStart(false);
    }

    function restart() {
      setSquares(Array.from({length: 4},()=> Array.from({length: 4}, () => null)));
      setStart(true);
    }

    document.onkeydown = (e) => { // control what happens when keys are hit
      let dir;
      if (e.code === "ArrowUp" || e.code === "KeyW") {
        console.log("up pressed");
        dir = UP;
      } 
      else if (e.code === "ArrowDown" || e.code === "KeyS") {
        console.log("down pressed");
        dir = DOWN;
      } 
      else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        console.log("left pressed");
        dir = LEFT;
      } 
      else if (e.code === "ArrowRight" || e.code === "KeyD") {
        console.log("right pressed");
        dir = RIGHT;
      }
      else {
        return;
      }
      let nextSquares = move(squares, dir);
      if (nextSquares != null) {
        const [i, j] = getRandomOpenSquare(nextSquares);
        if (i != null && j != null) {
          nextSquares[i][j] = newValue();
        }
        setSquares(nextSquares);
      }
    };
    
    let status = checkStatus(squares); // check for win/loss
    let squares1 = Array.from({length: 4},()=> Array.from({length: 4}, () => null));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) { 
        squares1[i][j] = squares[i][j];
      }
    }
    let squares2 = Array.from({length: 4},()=> Array.from({length: 4}, () => null));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) { 
        squares2[i][j] = squares[i][j];
      }
    }
    let squares3 = Array.from({length: 4},()=> Array.from({length: 4}, () => null));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) { 
        squares3[i][j] = squares[i][j];
      }
    }
    let squares4 = Array.from({length: 4},()=> Array.from({length: 4}, () => null));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) { 
        squares4[i][j] = squares[i][j];
      }
    }
    let up = move(squares1, UP);
    // if (up != null) {
    //   for (let i = 0; i < 4; i++) {
    //       console.log(squares[i][0], squares[i][1], squares[i][2], squares[i][3]);
    //   }
    //   console.log("break");
    //   for (let i = 0; i < 4; i++) {
    //     console.log(up[i][0], up[i][1], up[i][2], up[i][3]);
    //   }
    // }
    let down = move(squares2, DOWN, false);
    let left = move(squares3, LEFT, false);
    let right = move(squares4, RIGHT, false);
    if (up == null && down == null && left == null && right == null) {
       status = null; // do not keep playing if can't move in any direction
    }
    if (up != null) {
       console.log(up, "can move up");
    }
    if (down != null) {
      console.log(down, "can move down");
    }
    if (left != null) {
      console.log(left, "can move left");
    }
    if (right != null) {
      console.log(right, "can move right");
    }
    if (status == null) { // show proper buttons
      console.log("null");
      document.getElementById("restartbutton").setAttribute("class", "button button1");
    }
    else if (status == true) {
      console.log("true");
      document.getElementById("youwon").setAttribute("class", "button button1");
      document.getElementById("restartbutton").setAttribute("class", "button button1 hidden");
    }
    else if (status == false) { // hide all buttons
      console.log("false");
      document.getElementById("restartbutton").setAttribute("class", "button button1 hidden");
      document.getElementById("youwon").setAttribute("class", "button button1 hidden");
    }
    return ( // return the board object
      <>
        <div className="center-screen">
          <div className="board-row">
            <Square value={squares[0][0]} />
            <Square value={squares[0][1]} />
            <Square value={squares[0][2]} />
            <Square value={squares[0][3]} />
          </div>
        </div>
        <div className="center-screen">
          <div className="board-row">
            <Square value={squares[1][0]} />
            <Square value={squares[1][1]} />
            <Square value={squares[1][2]} />
            <Square value={squares[1][3]} />
          </div>
        </div>
        <div className="center-screen">
          <div className="board-row">
            <Square value={squares[2][0]} />
            <Square value={squares[2][1]} />
            <Square value={squares[2][2]} />
            <Square value={squares[2][3]} />
          </div>
        </div>
        <div className="center-screen">
          <div className="board-row">
            <Square value={squares[3][0]} />
            <Square value={squares[3][1]} />
            <Square value={squares[3][2]} />
            <Square value={squares[3][3]} />
          </div>
        </div>
        <div className="center-screen">
            <button className="button button1 hidden" id="restartbutton" onClick={restart}>restart</button>
            <button class="button button1 hidden" id="youwon">you won!</button>
        </div>
      </>
    );
}