import React, { useState } from "react";
import api from "../api"; // Убедись, что путь к api верный

export default function Login({ onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    user_login: "",
    user_password: "",
  });

  // Обработка изменений в форме
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Отправка данных формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Удаление старого токена, если он есть
    localStorage.removeItem("token"); // Удаляем старый токен перед авторизацией

    try {
      // Запрос на авторизацию
      const response = await api.post("/login", formData);

      // Проверяем, что токен есть в ответе
      if (response.data && response.data.access_token) {
        // Сохраняем новый токен в localStorage
        localStorage.setItem("token", response.data.access_token);

        // Запрашиваем данные о пользователе
        const userResponse = await api.get("/me");

        // Обновляем данные о пользователе в приложении
        onLoginSuccess(userResponse.data);

        alert("Вы успешно вошли!");
        onClose(); // Закрываем модальное окно
      } else {
        alert("Не удалось получить токен.");
      }
    } catch (err) {
      // Обработка ошибок авторизации
      alert("Ошибка авторизации: " + (err.response?.data?.detail || "Что-то пошло не так"));
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Войти в аккаунт</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="user_login">Логин:</label>
            <input
              type="text"
              id="user_login"
              name="user_login"
              value={formData.user_login}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="user_password">Пароль:</label>
            <input
              type="password"
              id="user_password"
              name="user_password"
              value={formData.user_password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-btn">Войти</button>
        </form>
      </div>
    </div>
  );
}
