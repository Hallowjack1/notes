import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";
import useDarkMode from "./hooks/useDarkMode";

function App() {
  const [page, setPage] = useState("login");
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [isDark, setIsDark] = useDarkMode();

  const handleLogin = (id, name) => {
    setUserId(id);
    setUsername(name);
    setPage("notes");
  };

  const handleLogout = () => {
    setUserId(null);
    setUsername("");
    setPage("login");
  };

  return (
    <>
      {page === "login" && (
        <Login onLogin={handleLogin} goToRegister={() => setPage("register")} isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
      )}
      {page === "register" && (
        <Register onRegistered={() => setPage("login")} goToLogin={() => setPage("login")} isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
      )}
      {page === "notes" && (
        <Notes userId={userId} username={username} onLogout={handleLogout} isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
      )}
    </>
  );
}

export default App;