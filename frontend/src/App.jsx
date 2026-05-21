import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";

function App() {
  const [page, setPage] = useState("login");
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");

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
        <Login onLogin={handleLogin} goToRegister={() => setPage("register")} />
      )}
      {page === "register" && (
        <Register onRegistered={() => setPage("login")} goToLogin={() => setPage("login")} />
      )}
      {page === "notes" && (
        <Notes userId={userId} username={username} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;