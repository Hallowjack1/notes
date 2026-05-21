import { useState, useEffect } from "react";
import EditModal from "../components/EditModal";

const TAGS = ["Personal", "Work", "Ideas", "School", "Other"];

function Notes({ userId, username, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  const fetchNotes = async () => {
    const res = await fetch(`http://localhost/notes/backend/api/notes.php?user_id=${userId}`);
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("http://localhost/notes/backend/api/notes.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, title, body, tag }),
    });
    const data = await res.json();
    if (data.success) {
      setTitle("");
      setBody("");
      setTag("");
      fetchNotes();
    } else {
      setError(data.message);
    }
  };

  const handleDelete = async (id) => {
    await fetch("http://localhost/notes/backend/api/delete.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, user_id: userId }),
    });
    fetchNotes();
  };

  const handleEditSave = async (id, editTitle, editBody, editTag) => {
    const res = await fetch("http://localhost/notes/backend/api/update.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, user_id: userId, title: editTitle, body: editBody, tag: editTag }),
    });
    const data = await res.json();
    if (data.success) {
      setEditingNote(null);
      fetchNotes();
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.body.toLowerCase().includes(search.toLowerCase());
    const matchesTag = filterTag === "" || note.tag === filterTag;
    return matchesSearch && matchesTag;
  });

  return (
    <>
      {editingNote && (
        <EditModal
          note={editingNote}
          onSave={handleEditSave}
          onClose={() => setEditingNote(null)}
        />
      )}

      <div className="app-layout">
        <div className="left-panel">
          <h3>New note</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea placeholder="Write your note..." rows="5" value={body} onChange={(e) => setBody(e.target.value)} required />
            <select value={tag} onChange={(e) => setTag(e.target.value)}>
              <option value="">No tag</option>
              {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <button type="submit">Add Note</button>
          </form>
        </div>

        <div className="right-panel">
          <div className="top-bar">
            <h2>My Notes</h2>
            <a onClick={onLogout}>Logout</a>
          </div>

          <input placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} />

          <div className="tag-filter">
            <button className={filterTag === "" ? "tag-btn active" : "tag-btn"} onClick={() => setFilterTag("")}>All</button>
            {TAGS.map((t) => (
              <button key={t} className={filterTag === t ? "tag-btn active" : "tag-btn"} onClick={() => setFilterTag(t)}>{t}</button>
            ))}
          </div>

          {filteredNotes.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#aaa" }}>
              {search || filterTag ? "No notes match your filter." : "No notes yet. Add one on the left!"}
            </p>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map((note) => (
                <div className="note-card" key={note.id}>
                  {note.tag && <span className="tag-badge">{note.tag}</span>}
                  <h4>{note.title}</h4>
                  <p>{note.body}</p>
                  <div className="note-footer">
                    <small>{formatDate(note.created_at)}</small>
                    <div className="note-actions">
                      <button className="edit-btn" onClick={() => setEditingNote(note)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(note.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Notes;