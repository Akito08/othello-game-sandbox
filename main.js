const board = [];
for (let y = 0; y < 10; y++) {
  board[y] = [];
  for (let x = 0; x < 10; x++) {
    if (x === 0 || y === 0 || x === 9 || y === 9) {
      board[y][x] = { value: -1 };
    } else {
      board[y][x] = { value: 0 };
    }
  }
}
board[4][4].value = 1;
board[5][5].value = 1;
board[5][4].value = 2;
board[4][5].value = 2;

const init = () => {
  const container = document.getElementById("container");
  for (let y = 1; y < 9; y++) {
    for (let x = 1; x < 9; x++) {
      const div = document.createElement("div");
      Object.assign(div.style, {
        position: "absolute",
        left: `${(x - 1) * 40}px`,
        top: `${(y - 1) * 40}px`,
        width: "40px",
        height: "40px",
        border: "solid 1px #000",
        backgroundColor: "#080"
      });
      container.appendChild(div);

      div.onpointerdown = () => {
        ondown(x, y);
      };

      const piece = document.createElement("div");
      div.appendChild(piece);
      Object.assign(piece.style, {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "#080"
      });

      board[y][x].element = piece;
    }
  }
};

const putPiece = (x, y, turn, action) => {
  if (board[y][x].value !== 0) {
    return false;
  }

  let total = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dy === 0 && dx === 0) {
        continue;
      }
      let cx = x + dx;
      let cy = y + dy;
      let c = 0;
      while (board[cy][cx].value === 3 - turn) {
        cx += dx;
        cy += dy;
        c++;
      }
      if (board[cy][cx].value === turn) {
        total += c;
        if (action) {
          board[y][x].value = turn;
          cx = x + dx;
          cy = y + dy;
          while (board[cy][cx].value === 3 - turn) {
            board[cy][cx].value = turn;
            cx += dx;
            cy += dy;
          }
        }
      }
    }
  }
  return total !== 0;
};

let currentTurn = 1;
let lastPass = false;

const changeTurn = () => {
  currentTurn = 3 - currentTurn;
  let pass = true;
  for (let y = 1; y < 9; y++) {
    for (let x = 1; x < 9; x++) {
      if (putPiece(x, y, currentTurn)) {
        pass = false;
      }
    }
  }
  if (pass) {
    if (lastPass) {
      // gameover
      let blackCount = board.flat().filter((v) => v.value === 1).length;
      let whiteCount = board.flat().filter((v) => v.value === 2).length;
      let message = `Black ${blackCount}: White ${whiteCount}. `;
      if (blackCount > whiteCount) {
        message += `Black won.`;
      } else if (whiteCount > blackCount) {
        message += "White won.";
      } else {
        message += "Draw.";
      }
      currentTurn = -1;
      document.getElementById("message").textContent = message;
    } else {
      lastPass = true;
      changeTurn();
    }
  } else {
    let message = "";
    if (lastPass) {
      message += currentTurn === 1 ? "White passed. " : "Black passed. ";
    }
    lastPass = false;
    message += currentTurn === 1 ? "Black to move." : "White to move.";
    document.getElementById("message").textContent = message;
  }
};

const computerMove = async () => {
  await new Promise((r) => setTimeout(r, 500));
  for (let y = 1; y < 9; y++) {
    for (let x = 1; x < 9; x++) {
      if (putPiece(x, y, currentTurn)) {
        putPiece(x, y, currentTurn, true);
        showBoard();
        changeTurn();
        if (currentTurn === 2) {
          computerMove();
        }
        return;
      }
    }
  }
};

const ondown = (x, y) => {
  if (board[y][x].value !== 0) {
    return;
  }
  if (currentTurn === 1) {
    if (putPiece(x, y, currentTurn)) {
      putPiece(x, y, currentTurn, true);
      showBoard();
      changeTurn();
      if (currentTurn === 2) {
        computerMove();
      }
    }
  }
};

const showBoard = () => {
  const colors = ["#080", "#000", "#fff"];
  for (let y = 1; y < 9; y++) {
    for (let x = 1; x < 9; x++) {
      const piece = board[y][x].element;
      piece.style.backgroundColor = colors[board[y][x].value];
    }
  }
};

window.onload = () => {
  init();
  showBoard();
};
