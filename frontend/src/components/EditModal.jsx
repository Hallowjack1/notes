import { useState } from "react";
import RichEditor from "./RichEditor";

const TAGS = ["Personal", "Work", "Ideas", "School", "Other"];

function EditModal({ note, folders, onSave, onClose }) {
  const [editTitle, setEditTitle] = useState(note.title);
  const [editBody, setEditBody] = useState(note.body);
  const [editTag, setEditTag] = useState(note.tag || "");
  const [editFolderId, setEditFolderId] = useState(note.folder_id || "");
  const [editReminder, setEditReminder] = useState(
    note.reminder_at ? note.reminder_at.slice(0, 16) : ""
  );

  const handleSave = () => {
    if (editTitle.trim() === "" || editBody.trim() === "") return;
    onSave(note.id, editTitle, editBody, editTag, editFolderId, editReminder);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleClearReminder = () => setEditReminder("");

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h3>Edit note</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
          />
            <RichEditor
              value={editBody}
              onChange={setEditBody}
              placeholder="Write your note..."
              rows={8}
            />
          <select value={editTag} onChange={(e) => setEditTag(e.target.value)}>
            <option value="">No tag</option>
            {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={editFolderId} onChange={(e) => setEditFolderId(e.target.value)}>
            <option value="">No folder</option>
            {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
              🔔 Reminder
            </label>
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                type="datetime-local"
                value={editReminder}
                onChange={(e) => setEditReminder(e.target.value)}
                style={{ flex: 1 }}
              />
              {editReminder && (
                <button
                  className="cancel-btn"
                  onClick={handleClearReminder}
                  style={{ width: "auto", padding: "6px 10px" }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;