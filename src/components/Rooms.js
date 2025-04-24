import React, { useState, useEffect } from "react";
import api from "../api";

const Rooms = () => {
  const [chessRooms, setChessRooms] = useState([]);
  const [draughtsRooms, setDraughtsRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get("/rooms/");
        setChessRooms(response.data.chess);
        setDraughtsRooms(response.data.draughts);
      } catch (error) {
        console.error("Error fetching rooms:", error.response?.data || error.message);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-xl font-bold text-purple-500 mb-3">Chess Rooms</h3>
        {chessRooms.map((room) => (
          <div key={room.id} className="bg-gray-700 p-2 rounded mb-2">
            Room Code: {room.room_code} - Color: {room.color}
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-xl font-bold text-orange-500 mb-3">Draughts Rooms</h3>
        {draughtsRooms.map((room) => (
          <div key={room.id} className="bg-gray-700 p-2 rounded mb-2">
            Room Code: {room.room_code} - Color: {room.color}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
