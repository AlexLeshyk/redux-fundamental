import Board from "../../components/board/board";
import { useState } from "react";
import { calculateWinner } from "../../utils/calculateWinner";

const Game = () => {
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
    },
  ]);
  const [xIsNext, setxIsNext] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ? "Перейти к ходу #" + move : "К началу игры";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = "Выиграл " + winner;
  } else {
    status = "Следующий ход: " + (xIsNext ? "X" : "O");
  }

  const handleClick = (i) => {
    setHistory(history.slice(0, stepNumber + 1));
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    setHistory(
      history.concat([
        {
          squares: squares,
        },
      ])
    );
    setxIsNext(!xIsNext);
    setStepNumber(history.length);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setxIsNext(step % 2 === 0);
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onHandleClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

export default Game;
