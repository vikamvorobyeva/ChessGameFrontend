import React, { useState } from "react";

export default function RoomCreate({ onClose }) {
  const [roomName, setRoomName] = useState("");
  const [gameType, setGameType] = useState("chess"); // По умолчанию шахматы

  const handleCreate = () => {
    console.log("Room Created:", { roomName, gameType });
    onClose(); // Закрыть окно после создания
  };

  return (
    <div className="room-create-overlay">
      <div className="room-create-modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>Создать новую комнату</h2>
        <div className="input-group">
          <label>Название комнаты</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Введите название комнаты"
          />
        </div>
        <div className="input-group">
          <label>Тип игры</label>
          <select
            value={gameType}
            onChange={(e) => setGameType(e.target.value)}
          >
            <option value="chess">Шахматы</option>
            <option value="checkers">Шашки</option>
          </select>
        </div>
        <div className="buttons-container">
          <button className="create-btn" onClick={handleCreate}>
            Создать
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
