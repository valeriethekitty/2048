import { useState } from 'react';

const UP = 0; // create constants for easier reading
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

function Square({ value }) { // generate square object, taken from tic tac toe tutorial
    return <button className="square">{value}</button>;
}

function getRandomOpenSquare(squares) { // get a random open square to add the new value
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {

    }
  }
  return [3, 0];
}

function newValue() { // return randomly either a 2 or 4, to be added when you move
  if (Math.floor(Math.random() * 2) == 1) {
    return 4;
  }
  else {
    return 2;
  }
}

function move(squares, direction) { // return the new squares to move to
  let nextSquares =  Array.from({length: 4},()=> Array.from({length: 4}, () => null));
  if (direction == UP) { // for up, it needs to count rows forward for the priority
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (squares[i][j] != null) {
          let x = newPosition(nextSquares, i, j, direction);
          if (x != null) {
            nextSquares[x][j] = squares[i][j];
          }
        }
      }
    }
  }
  else if (direction == DOWN) { // for down, it needs to count rows backward for the priority
    /*for (let i = squares.length - 1; i >= 0; i--) {
      if (squares[i] != null) {
        let newPos = newPosition(nextSquares, i, direction);
        if (newPos) {
          nextSquares[newPos] = squares[i];
        }
      }
    }*/
  }
  else if (direction == LEFT) { // for left, it needs to count columns forward for the priority

  }
  else if (direction == RIGHT) { // for right, it needs to count columns backward for the priority

  }
  return nextSquares;
}

function newPosition(nextSquares, i, j, direction) { // return new position of square
  if (direction == UP) { // up priority { {0, 0}, {0, 1}, {0, 2}, {0, 3} }, { {1, 0}, {1, 1}, {1, 2}, {1, 3} }, { {2, 0}, {2, 1}, {2, 2}, {2, 3} }, { {3, 0}, {3, 1}, {3, 2}, {3, 3} }
    if (i == 0) { // if i, j is top row, it does not move
      return i;
    }
    if (i == 1) { // check the next row
      if (nextSquares[i - 1][j] == null) { // if the higher square is null, it moves there
        return i - 1; // j stays the same so just return the new i value
      }
      else { // otherwise, it does not move
        return i;
      }
    }
    if (i == 2) { // check the next row 
      if (nextSquares[i - 2][j] == null) { // if the highest square is null, it moves there
        return i - 2;
      }
      if (nextSquares[i - 1][j] == null) { // if the next highest square is null, it moves there
        return i - 1;
      }
      else { // otherwise, it does not move
        return i;
      }
    }
    if (i == 3) { // check the next row 
      if (nextSquares[i - 3][j] == null) { // if the highest square is null, it moves there
        return i - 3;
      }
      if (nextSquares[i - 2][j] == null) { // if the next highest square is null, it moves there
        return i - 2;
      }
      if (nextSquares[i - 1][j] == null) { // if the next highest square is null, it moves there
        return i - 1;
      }
      else { // otherwise, it does not move
        return i;
      }
    }
  }
  /*else if (direction == DOWN) { // down priority { {3, 0}, {3, 1}, {3, 2}, {3, 3} }, { {2, 0}, {2, 1}, {2, 2}, {2, 3} }, { {1, 0}, {1, 1}, {1, 2}, {1, 3} }, { {0, 0}, {0, 1}, {0, 2}, {0, 3} }
    if (i + 4 > 15) { // if i is bottom row, it does not move 
      return i;  
    }
  }
  else if (direction == LEFT) { // left priority { {0, 0}, {1, 0}, {2, 0}, {3, 0} }, { {0, 1}, {1, 1}, {2, 1}, {3, 1} }, { {0, 2}, {1, 2}, {2, 2}, {3, 2} }, { {0, 3}, {1, 3}, {2, 3}, {3, 3} }
    if (i % 4 == 0) { // if i is left column, it does not move 
      return i;
    }
  }
  else if (direction == RIGHT) { // right priority { {0, 3}, {1, 3}, {2, 3}, {3, 3} }, { {0, 2}, {1, 2}, {2, 2}, {3, 2} }, { {0, 1}, {1, 1}, {2, 1}, {3, 1} }, { {0, 0}, {1, 0}, {2, 0}, {3, 0} }
    if (i % 4 == 3) { // if i is right column, it does not move
      return i;
    }
  }*/
  return null;
}

export default function Board() { // board inspired by tic tac toe tutorial
  const [squares, setSquares] = useState(Array.from({length: 4},()=> Array.from({length: 4}, () => null)));
  const [start, setStart] = useState(true);
  const [canMove, setMove] = useState(true);
    if (start) { // generate the starting square randomly as either 2 or 4
      const beginningSquares = squares.slice();
      const [i, j] = getRandomOpenSquare(squares);
      beginningSquares[i][j] = newValue();
      setSquares(beginningSquares);
      setStart(false);
    }
    // squares, onPlay
    // onPlay(next);
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
      const [i, j] = getRandomOpenSquare(nextSquares);
      nextSquares[i][j] = newValue();
      setSquares(nextSquares);
    };
    return ( // return the board object
      <>
        <div className="board-row">
          <Square value={squares[0][0]} />
          <Square value={squares[0][1]} />
          <Square value={squares[0][2]} />
          <Square value={squares[0][3]} />
        </div>
        <div className="board-row">
          <Square value={squares[1][0]} />
          <Square value={squares[1][1]} />
          <Square value={squares[1][2]} />
          <Square value={squares[1][3]} />
        </div>
        <div className="board-row">
          <Square value={squares[2][0]} />
          <Square value={squares[2][1]} />
          <Square value={squares[2][2]} />
          <Square value={squares[2][3]} />
        </div>
        <div className="board-row">
          <Square value={squares[3][0]} />
          <Square value={squares[3][1]} />
          <Square value={squares[3][2]} />
          <Square value={squares[3][3]} />
        </div>
      </>
    );
}