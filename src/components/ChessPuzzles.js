import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Papa from "papaparse";

const ChessPuzzles = () => {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState("Загрузка задач...");
  const [puzzles, setPuzzles] = useState([]);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);

  // Загружаем CSV-файл с задачами без кеширования
  useEffect(() => {
    console.log("📥 Загружаем шахматные задачи...");

    fetch(`/lichess_db_puzzle.csv?t=${Date.now()}`)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: false,  // В файле НЕТ заголовков
          skipEmptyLines: true,
          complete: (results) => {
            console.log("📄 Загруженные шахматные задачи:", results.data); // Отладка

            if (results.data.length > 0) {
              // Lichess хранит данные в таком порядке:
              // 0 - ID задачи
              // 1 - FEN (начальная позиция)
              // 2 - Решение (ходы)
              const parsedPuzzles = results.data.map(row => ({
                fen: row[1],         // Вторая колонка (начальная позиция)
                solution: row[2],    // Третья колонка (ходы)
              }));

              setPuzzles(parsedPuzzles);
              loadRandomPuzzle(parsedPuzzles);
            } else {
              setStatus("Ошибка загрузки задач.");
            }
          },
        });
      })
      .catch(() => setStatus("Ошибка загрузки CSV-файла."));
  }, []);

  // Выбираем случайную задачу
  const loadRandomPuzzle = (puzzles) => {
    if (!puzzles || puzzles.length === 0) {
      console.warn("⚠️ Нет доступных задач.");
      return;
    }
    const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    console.log("♟️ Загружена новая задача:", randomPuzzle);
    setCurrentPuzzle(randomPuzzle);
    setGame(new Chess(randomPuzzle.fen)); // Убедись, что FEN — это правильное название поля
    setStatus("Решите задачу!");
  };

  // Проверяем правильность хода
  const onDrop = (sourceSquare, targetSquare) => {
    if (!currentPuzzle) return false;

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return false;

    setGame(new Chess(game.fen()));

    // Проверяем, есть ли ход в списке решений (Lichess может давать несколько решений через пробел)
    if (currentPuzzle.solution.split(" ").includes(`${sourceSquare}${targetSquare}`)) {
      setStatus("✅ Правильно! 🎉");
    } else {
      setStatus("❌ Неправильно, попробуйте снова.");
    }

    return true;
  };

  return (
    <div className="chess-puzzles-container">
      <h2>♟️ Шахматные задачи</h2>
      {currentPuzzle ? (
        <>
          <Chessboard position={game.fen()} onPieceDrop={onDrop} />
          <p>{status}</p>
          <button onClick={() => loadRandomPuzzle(puzzles)}>🔄 Новая задача</button>
        </>
      ) : (
        <p>{status}</p>
      )}
    </div>
  );
};

export default ChessPuzzles;
