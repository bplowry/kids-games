import { useState } from "react";
import "./App.css";
import { Marker, checkWinner, getRows, makeBoard, place } from "./board";

function App() {
  const [player, setPlayer] = useState<Marker>("X");
  const togglePlayer = () => setPlayer((prev) => (prev === "X" ? "O" : "X"));

  const [columnIndex, setColumnIndex] = useState(0);

  const [board, setBoard] = useState(makeBoard(6, 7));

  const [winner, setWinner] = useState<Marker | null>(null);

  const rows = getRows(board).reverse();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
    if (winner) {
      setWinner(null);
      setBoard(makeBoard(6, 7));
      setColumnIndex(0);
      setPlayer("X");
      return;
    }

    if (e.key === "ArrowLeft") {
      setColumnIndex((prev) => (prev === 0 ? 0 : prev - 1));
    }
    if (e.key === "ArrowRight") {
      setColumnIndex((prev) =>
        prev > board.columnCount - 2 ? board.columnCount - 1 : prev + 1
      );
    }
    if (e.key === "ArrowDown" || e.key === "Enter") {
      const result = place(columnIndex, player, board);
      if (result === false) {
        return;
      }
      setBoard(result);

      const win = checkWinner(board);
      if (win) {
        setWinner(win);
      }

      togglePlayer();
    }
  };

  return (
    <div style={{ padding: 32 }} tabIndex={1} onKeyDown={handleKeyDown}>
      <pre>
        {`
======== CONNECT FOUR ========

${
  winner
    ? `${winner === "X" ? "🔴" : "🔵"} WINS!`
    : `${player === "X" ? "🔴" : "🔵"} - it's your turn`
}

${
  winner
    ? `PRESS ANY KEY TO PLAY AGAIN
`
    : `
` +
      board.columns
        .map((_, thisIndex) => `| ` + (columnIndex == thisIndex ? "👇" : "🫥"))
        .join(" ")
        .concat(" |")
}
---------------------------------
${rows.map((r) =>
  r
    .map((c) => `| ` + (c === "X" ? "🔴" : c === "O" ? "🔵" : "🫥"))
    .join(" ")
    .concat(` |`)
).join(`
`)}
      `}
      </pre>
    </div>
  );
}

export default App;
