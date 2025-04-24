import React, { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function PlayWithAI() {
  const [game, setGame] = useState(new Chess());

  const makeMove = (sourceSquare, targetSquare) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // всегда превращаем пешку в ферзя
    });

    if (move === null) return false; // если ход некорректный, возвращаем false
    setGame(new Chess(game.fen())); // обновляем состояние игры
    return true;
  };

  const makeAIMove = () => {
    const moves = game.moves();
    if (moves.length > 0) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      game.move(randomMove);
      setGame(new Chess(game.fen()));
    }
  };

  const onDrop = (sourceSquare, targetSquare) => {
    const move = makeMove(sourceSquare, targetSquare);
    if (move) {
      setTimeout(makeAIMove, 500); // AI делает ход через 500 мс
    }
  };

  const resetGame = () => {
    setGame(new Chess());
  };

  return (
    <div className="play-with-ai-container">
      <h1>Играть с компьютером</h1>
      <div className="chessboard-wrapper">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardWidth={400} // Устанавливаем размер доски
        />
      </div>
      <button onClick={resetGame} className="reset-button">
        Сбросить игру
      </button>
    </div>
  );
}
