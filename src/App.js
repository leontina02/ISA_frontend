import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import BookList from "./components/BookList";
import LoginForm from "./components/LoginForm";
import EventList from "./components/EventList";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div className="App">
        {token ? (
          <div>
            <nav className="navbar">
              <ul className="navbar-links">
                <li>
                  <Link to="/books" className="active">
                    Knjige
                  </Link>
                </li>
                <li>
                  <Link to="/events">Događaji</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="navbar-logout">
                    Odjavi se
                  </button>
                </li>
              </ul>
            </nav>
            <Routes>
              <Route path="/books" element={<BookList token={token} />} />
              <Route path="/events" element={<EventList token={token} />} />
              <Route path="/" element={<h1>Welcome to the Library App</h1>} />
            </Routes>
          </div>
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
}

export default App;
