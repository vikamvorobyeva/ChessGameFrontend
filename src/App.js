import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './style.css'; // Подключаем обновленные стили
import Registration from "./components/Registration"; // Если файл в папке components
import Login from "./components/Login"
import RoomCreate from "./components/RoomCreate";
import PlayWithAI from "./components/PlayWithAI";
import logo from './ChessRabbitLogo.png';
import ChessPuzzles from "./components/ChessPuzzles";
import api from "./api"; // для работы с токеном и авторизацией



const TWITCH_CLIENT_ID = "ysx7mnim0tag3aque17t8s527udfth";
const TWITCH_ACCESS_TOKEN = "04l8ehohlw878o5e9ltujl28b05ffk";

const translations = {
  ru: {
    createGame: "Создать игру",
    joinGame: "Играть с другом",
    playWithAI: "Играть с компьютером",
    chessPuzzles: "Решать задачи",
    switchTheme: "Переключить тему",
    switchLanguage: "Переключить язык",
    chessNews: "Шахматные новости",
    selectGame: "Выберите игру",
    chess: "Шахматы",
    checkers: "Шашки",
    login: "Войти",
    register: "Регистрация",
    quickStart: "Быстрый старт",
    bullet: "Буллет",
    blitz: "Блиц",
    rapid: "Рапид",
    classical: "Классические",
    customTime: "Своя игра",
    watchStreamers: "Стримеры",
    events: "Текущие события",
    readMore: "Читать далее",
    loadingNews: "Загрузка новостей...",
    footerDisclaimer: "© 2025 Мой Шахматный Сайт. Все права защищены.",
  },
  en: {
    createGame: "Create Game",
    joinGame: "Play with Friend",
    playWithAI: "Play with AI",
    chessPuzzles: "Solve puzzles",
    switchTheme: "Switch Theme",
    switchLanguage: "Switch Language",
    chessNews: "Chess News",
    selectGame: "Select Game",
    chess: "Chess",
    checkers: "Checkers",
    login: "Login",
    register: "Register",
    quickStart: "Quick Start",
    bullet: "Bullet",
    blitz: "Blitz",
    rapid: "Rapid",
    classical: "Classical",
    customTime: "Custom",
    watchStreamers: "Streamers",
    events: "Current Events",
    readMore: "Read more",
    loadingNews: "Loading news...",
    footerDisclaimer: "© 2025 My Chess Site. All rights reserved.",
  },
};




function App() {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("ru");
  const [selectedGame, setSelectedGame] = useState(null);
  const [news, setNews] = useState([]); // Для загрузки новостей

  const t = (key) => translations[language][key] || key;
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const handleRegistrationClick = () => {
    setShowRegistration(true);
  };

  const closeRegistration = () => {
    setShowRegistration(false);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const closeLogin = () => {
    setShowLogin(false);
  };

  const [showCreateRoom, setShowCreateRoom] = useState(false);

  const handleCreateRoomClick = () => {
    setShowCreateRoom(true);
  };

  const closeCreateRoom = () => {
    setShowCreateRoom(false);
  };

  const [user, setUser] = useState(null); // хранение авторизованного пользователя


  // Переключение темы
    const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      document.documentElement.style.setProperty("--primary-color", "#8A2BE2"); // Фиолетовый
      document.documentElement.style.setProperty("--highlight-color", "#8A2BE2"); // Фиолетовый
      document.documentElement.style.setProperty("--bg-color-dark", "#008000"); // Зеленый фон
    } else {
      setTheme("dark");
      document.documentElement.style.setProperty("--primary-color", "#ff6600"); // Оранжевый
      document.documentElement.style.setProperty("--highlight-color", "#ff6600"); // Оранжевый
      document.documentElement.style.setProperty("--bg-color-dark", "#212121"); // Черный фон
    }
  };


  // Переключение языка
  const toggleLanguage = () => {
    setLanguage(language === "ru" ? "en" : "ru");
  };

  const GUARDIAN_API_KEY = "6e2382b3-fa3e-4839-a659-b6f9818dfc69";

  const FALLBACK_STREAMERS = [
  "gmhikaru",
  "chess",
  "gothamchess",
  "botezlive",
  "penguingm1",
  ];

  const [streamers, setStreamers] = useState([]);

    useEffect(() => {
    const chessDotComCategoryId = "743"; // ID категории Chess (проверьте актуальность)

    async function fetchChessStreams() {
      try {
        console.log("🔍 Запрашиваем активные стримы в категории Chess.com...");

        const url = `https://api.twitch.tv/helix/streams?first=5&game_id=${chessDotComCategoryId}`;

        const response = await fetch(url, {
          headers: {
            "Client-ID": TWITCH_CLIENT_ID,
            Authorization: `Bearer ${TWITCH_ACCESS_TOKEN}`,
          },
        });

        const data = await response.json();

        if (data.data && data.data.length > 0) {
          console.log(`✅ Найдено ${data.data.length} активных стримов Chess`);

          const userIds = data.data.map((stream) => stream.user_id);

          const userUrl = `https://api.twitch.tv/helix/users?${userIds
            .map((id) => `id=${id}`)
            .join("&")}`;

          const userResponse = await fetch(userUrl, {
            headers: {
              "Client-ID": TWITCH_CLIENT_ID,
              Authorization: `Bearer ${TWITCH_ACCESS_TOKEN}`,
            },
          });

          const userData = await userResponse.json();

          const activeStreamers = data.data.map((stream) => {
            const user = userData.data.find((u) => u.id === stream.user_id);
            return {
              id: stream.user_id,
              login: user?.login || "Unknown",
              display_name: user?.display_name || "Unknown",
              profile_image_url:
                user?.profile_image_url || "https://via.placeholder.com/70",
              viewer_count: stream.viewer_count,
              is_live: true,
            };
          });

          const sorted = activeStreamers
            .sort((a, b) => b.viewer_count - a.viewer_count)
            .slice(0, 5);

          setStreamers(sorted);
        } else {
          console.warn("⚠️ Нет активных стримов в категории Chess.com. Загружаем fallback...");
          fetchFallbackStreamers();
        }
      } catch (error) {
        console.error("🚨 Ошибка загрузки стримеров:", error);
        fetchFallbackStreamers();
      }
    }

    async function fetchFallbackStreamers() {
      try {
        console.log("🔍 Загружаем fallback-стримеров из списка:", FALLBACK_STREAMERS);

        const userUrl = `https://api.twitch.tv/helix/users?${FALLBACK_STREAMERS.map(
          (login) => `login=${login}`
        ).join("&")}`;

        const response = await fetch(userUrl, {
          headers: {
            "Client-ID": TWITCH_CLIENT_ID,
            Authorization: `Bearer ${TWITCH_ACCESS_TOKEN}`,
          },
        });

        const data = await response.json();

        const fallbackStreamersInfo = data.data.map((user) => ({
          id: user.id,
          login: user.login,
          display_name: user.display_name,
          profile_image_url: user.profile_image_url || "https://via.placeholder.com/70",
          viewer_count: 0, // Они оффлайн, поэтому зрителей нет
          is_live: false,
        }));

        setStreamers(fallbackStreamersInfo);
      } catch (error) {
        console.error("🚨 Ошибка загрузки fallback-стримеров:", error);
        setStreamers([]); // Очищаем список в случае ошибки
      }
    }

    fetchChessStreams();
  }, []);

  useEffect(() => {
    async function fetchChessNews() {
      try {
        console.log("🔍 Загружаем шахматные новости...");

        const url = `https://content.guardianapis.com/search?q=chess&api-key=${GUARDIAN_API_KEY}&show-fields=thumbnail,trailText`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.response.results.length > 0) {
          console.log("✅ Найдено новостей:", data.response.results.length);
          setNews(data.response.results.slice(0, 5)); // Оставляем только 5 новостей
        } else {
          console.warn("⚠️ Нет свежих шахматных новостей!");
          setNews([]);
        }
      } catch (error) {
        console.error("🚨 Ошибка загрузки шахматных новостей:", error);
      }
    }

    fetchChessNews();
  }, []);

  // Применяем классы для темы
  useEffect(() => {
    document.body.classList.toggle("dark-theme", theme === "dark");
    document.body.classList.toggle("light-theme", theme === "light");
    document.body.style.backgroundColor = theme === "dark" ? "#212121" : "#008000"; // Меняем фон
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/me")
       .then((res) => setUser(res.data))
       .catch(() => localStorage.removeItem("token"));
    }
  }, []);



  // Выбор игры (шахматы или шашки)
  const handleGameSelection = (game) => {
    setSelectedGame(game);
  };

return (
  <div className="app-container">
    {/* ========== HEADER ========== */}
    <header className="site-header">
      <div className="header-left">
        <Link to="/" className="logo-container">
          <img src={logo} alt="ChessRabbit Logo" className="logo" />
          <span className="site-title">ChessRabbit</span>
        </Link>
        <nav>
          <Link
            to="/create"
            className="header-link"
            onClick={(e) => {
              e.preventDefault(); // Предотвращаем переход по ссылке
              handleCreateRoomClick(); // Открываем функционал создания комнаты
            }}
          >
            {t("createGame")}
          </Link>

          <Link to="/join" className="header-button">
            {t("joinGame")}
          </Link>
          <Link to="/ai" className="header-link">{t("playWithAI")}</Link>
          <Link to="/puzzles" className="header-link">{t("chessPuzzles")}</Link>
        </nav>
      </div>

      <div className="header-right">
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span className="user-welcome">Привет, {user.user_name}</span>
              <button
                className="header-button"
                onClick={() => {
                  localStorage.removeItem("token");
                  setUser(null);
                  alert("Вы вышли из аккаунта");
                }}
              >
                Выйти
              </button>
            </div>
          ) : (
            <>
              <button onClick={handleLoginClick} className="header-button">
                {t("login")}
              </button>
              <button onClick={handleRegistrationClick} className="header-button">
                {t("register")}
              </button>
            </>
          )}
      </div>

    </header> {/* ✅ ВОТ это был пропущенный закрывающий тег */}

    {showRegistration && <Registration onClose={closeRegistration} />}
    {showLogin && <Login onClose={closeLogin} onLoginSuccess={setUser} />}
    {showCreateRoom && <RoomCreate onClose={closeCreateRoom} />}

      {/* ========== ОСНОВНОЙ КОНТЕЙНЕР ========== */}
      <div className="main-wrapper">
        {/* ========== SIDEBAR ========== */}
        {/* Секция стримеров (для примера) */}
        {/* Секция стримеров (для Twitch) */}
        {/* ========== SIDEBAR ========== */}
        <aside className="streamers-section">
          <h2 className="streamers-header">♟️ Популярные шахматные стримеры</h2>

          {streamers.length > 0 ? (
              streamers.map((streamer) => (
                  <a
                      key={streamer.id}
                      href={`https://www.twitch.tv/${streamer.login}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="streamer"
                  >
                    <img
                        src={streamer.profile_image_url}
                        alt={streamer.display_name}
                        className="streamer-avatar"
                    />
                    <div className="streamer-info">
                      <div className="streamer-name">{streamer.display_name}</div>
                      <div className={`streamer-status ${streamer.is_live ? "live" : "offline"}`}>
                        {streamer.is_live
                            ? `🟢 В эфире | ${streamer.viewer_count} зрителей`
                            : `🔴 Оффлайн`}
                      </div>
                    </div>
                  </a>
              ))
          ) : (
              <p className="no-streamers">⏳ Загружаем список стримеров...</p>
          )}
        </aside>

        {/* ========== ОСНОВНОЙ КОНТЕНТ ========== */}
        <main className="content">
          <div className="quick-start-container">
            <div className="quick-start-title">{t("quickStart")}</div>
            <div className="time-controls-grid">
              <button className="time-control-button">1+0 {t("bullet")}</button>
              <button className="time-control-button">2+1 {t("bullet")}</button>
              <button className="time-control-button">3+0 {t("blitz")}</button>
              <button className="time-control-button">3+2 {t("blitz")}</button>
              <button className="time-control-button">5+0 {t("blitz")}</button>
              <button className="time-control-button">5+3 {t("blitz")}</button>
              <button className="time-control-button">10+0 {t("rapid")}</button>
              <button className="time-control-button">10+5 {t("rapid")}</button>
              <button className="time-control-button">15+10 {t("rapid")}</button>
              <button className="time-control-button">30+0 {t("classical")}</button>
              <button className="time-control-button">30+20 {t("classical")}</button>
              <button className="time-control-button">{t("customTime")}</button>
            </div>
          </div>

          {/* Блок выбора игры (шахматы/шашки) */}
          <div style={{marginBottom: '2rem'}}>
            <h3>{t("selectGame")}</h3>
            <button
                style={{marginRight: '1rem'}}
                onClick={() => handleGameSelection("chess")}
            >
              {t("chess")}
            </button>
            <button onClick={() => handleGameSelection("checkers")}>
              {t("checkers")}
            </button>
            {selectedGame && (
                <p>
                  Вы выбрали:{" "}
                  {selectedGame === "chess" ? t("chess") : t("checkers")}
                </p>
            )}
          </div>


          <div className="news-block">
            <h2>{t("chessNews")}</h2>
            {news.length > 0 ? (
                news.map((article, index) => (
                    <div className="news-item" key={index}>
                      <img src={article.fields.thumbnail || "https://via.placeholder.com/150"} alt="News"/>
                      <div className="news-content">
                        <div className="news-item-title">{article.webTitle}</div>
                        <div className="news-item-description">{article.fields.trailText}</div>
                        <a href={article.webUrl} target="_blank" rel="noopener noreferrer">
                          {t("readMore")}
                        </a>
                      </div>
                    </div>
                ))
            ) : (
                <p>{t("loadingNews")}</p>
            )}
          </div>


          {/* Кнопки переключения темы и языка (можно разместить где угодно) */}
          <div className="theme-toggle-container">
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {t("switchTheme")}
            </button>
            <button className="theme-toggle-btn" onClick={toggleLanguage}>
              {t("switchLanguage")}
            </button>
          </div>
        </main>
      </div>

      {/* ========== FOOTER ========== */}
      <footer>
        <p>{translations[language].footerDisclaimer}</p>
        <p>
          <a href="https://github.com/your-project" target="_blank" rel="noreferrer">
            GitHub
          </a>
          |
          <a href="https://your-website.com/contact" target="_blank" rel="noreferrer">
            Contact
          </a>
        </p>
      </footer>
    </div>
  );
}


// Обертка роутера
export default function MainApp() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<App/>}/>
          {/* Пример дополнительных маршрутов */}
          <Route path="/create" element={<div>Страница создания игры</div>}/>
          <Route path="/join" element={<div>Страница присоединения к игре</div>}/>
          <Route path="/ai" element={<PlayWithAI />} />
          <Route path="/puzzles" element={<ChessPuzzles />} />
        </Routes>
      </Router>
  );
}
