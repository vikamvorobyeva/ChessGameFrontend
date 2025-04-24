import React from "react";
import ReactDOM from "react-dom/client"; // Обратите внимание на "react-dom/client"
import MainApp from "./App"; // Убедитесь, что путь к App.js правильный
import "./style.css"; // Убедитесь, что стиль загружается

// Находим элемент "root"
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('❌ Root element с id "root" не найден в index.html!');
}

// Создаем корневой рендеринг
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);

// ✅ Отладочный лог
console.log("✅ Приложение успешно запущено!");
