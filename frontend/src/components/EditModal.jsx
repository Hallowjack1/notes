import { useState } from "react";

const TAGS = ["Personal", "Work", "Ideas", "School", "Other"];

function EditModal({ note, onSave, onClose }) {
  const [editTitle, setEditTitle] = useState(note.title);
  const [editBody, setEditBody] = useState(note.body);
  const [editTag, setEditTag] = useState(note.tag || "");

  const handleSave = () => {
    if (editTitle.trim() === "" || editBody.trim() === "") return;
    onSave(note.id, editTitle, editBody, editTag);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

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
          <textarea
            rows="8"
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            placeholder="Write your note..."
          />
          <select value={editTag} onChange={(e) => setEditTag(e.target.value)}>
            <option value="">No tag</option>
            {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
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