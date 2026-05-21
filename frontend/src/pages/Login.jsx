import { useState } from "react";
import DarkToggle from "../components/DarkToggle";

function Login({ onLogin, goToRegister, isDark, onToggleDark }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost/notes/backend/api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
      onLogin(data.user_id, data.username);
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="auth-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Login</h2>
        <DarkToggle isDark={isDark} onToggle={onToggleDark} />
      </div>        
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <p style={{ fontSize: "13px" }}>No account yet? <a onClick={goToRegister} style={{ color: "#4a90e2", cursor: "pointer" }}>Register</a></p>
    </div>
  );
}

export default Login;