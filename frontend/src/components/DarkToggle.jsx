function DarkToggle({ isDark, onToggle }) {
  return (
    <div className="dark-toggle" onClick={onToggle}>
      {isDark ? "🌙" : "☀️"}
      <div className={`toggle-track ${isDark ? "on" : ""}`}>
        <div className="toggle-thumb" />
      </div>
    </div>
  );
}

export default DarkToggle;