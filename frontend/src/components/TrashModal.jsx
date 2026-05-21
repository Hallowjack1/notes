import { useState, useEffect } from "react";

function TrashModal({ userId, onClose, onRestored }) {
  const [notes, setNotes] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const fetchTrash = async () => {
    const res = await fetch(`http://localhost/notes/backend/api/trash.php?user_id=${userId}`);
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleAction = async (id, action) => {
    await fetch("http://localhost/notes/backend/api/trash.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, user_id: userId, action }),
    });
    if (action === "restore") {
      onRestored();
    }
    fetchTrash();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpanded = (id) => expandedId === id;

  const toggleExpand = (id) => {
    setExpandedId(isExpanded(id) ? null : id);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal trash-modal">
        <div className="modal-header">
          <h3>Trash</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {notes.length === 0 ? (
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Trash is empty.</p>
          ) : (
            <div className="trash-grid">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="trash-card"
                  onClick={() => toggleExpand(note.id)}
                >
                  {note.tag && <span className="tag-badge">{note.tag}</span>}

                  <p className="trash-card-title">{note.title}</p>

                  <p style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: isExpanded(note.id) ? "unset" : 3,
                    maxHeight: isExpanded(note.id) ? "none" : "54px",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    }}>
                    {note.body}
                  </p>

                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                    {isExpanded(note.id) ? "Click to collapse" : "Click to expand"} · Deleted: {formatDate(note.deleted_at)}
                  </p>

                  <div
                    className="note-actions"
                    style={{ marginTop: "8px" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="edit-btn" onClick={() => handleAction(note.id, "restore")}>
                      Restore
                    </button>
                    <button className="delete-btn" onClick={() => handleAction(note.id, "permanent")}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notes.length > 0 && (
          <div className="modal-footer">
            <button
              style={{ background: "#e74c3c", color: "white", border: "none", borderRadius: "8px", padding: "9px", fontSize: "14px", cursor: "pointer", width: "100%" }}
              onClick={async () => {
                await Promise.all(notes.map((n) => handleAction(n.id, "permanent")));
              }}
            >
              Empty trash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrashModal;