import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

function SharedNote({ token }) {
  const [note, setNote] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      const res = await fetch(`${API}/view.php?token=${token}`);
      const data = await res.json();
      if (data.success) {
        setNote(data.note);
      } else {
        setError(data.message);
      }
    };
    fetchNote();
  }, [token]);

  if (error) {
    return (
      <div className="auth-container">
        <h2>Note not found</h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>{error}</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="auth-container">
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="shared-note-container">
      <div className="shared-note-card">
        <div className="shared-note-header">
          <h1>{note.title}</h1>
          {note.tag && <span className={`tag-badge tag-${note.tag}`}>{note.tag}</span>}
          <small style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            {new Date(note.created_at).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric"
            })}
          </small>
        </div>
        <div
          className="shared-note-body"
          dangerouslySetInnerHTML={{ __html: note.body }}
        />
      </div>
    </div>
  );
}

export default SharedNote;