import { useState } from "react";

const TAGS = ["Personal", "Work", "Ideas", "School", "Other"];

function FolderSidebar({
  folders,
  activeFolderId,
  activeCategory,
  notes,
  onSelectFolder,
  onSelectCategory,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
}) {
  const [newFolderName, setNewFolderName] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleCreate = () => {
    if (newFolderName.trim() === "") return;
    onCreateFolder(newFolderName.trim());
    setNewFolderName("");
    setShowInput(false);
  };

  const handleRename = (id) => {
    if (renameValue.trim() === "") return;
    onRenameFolder(id, renameValue.trim());
    setRenamingId(null);
    setRenameValue("");
  };

  const pinnedCount = notes.filter((n) => n.pinned == 1).length;
  const tagCounts = TAGS.reduce((acc, tag) => {
    const count = notes.filter((n) => n.tag === tag).length;
    if (count > 0) acc[tag] = count;
    return acc;
  }, {});

  const reminderCount = notes.filter((n) => n.reminder_at && new Date(n.reminder_at) > new Date()).length;
    {reminderCount > 0 && (
      <div
        className={`folder-item ${activeCategory === "reminders" ? "active" : ""}`}
        onClick={() => onSelectCategory("reminders")}
      >
        <span>🔔 Reminders</span>
        <span className="folder-count">{reminderCount}</span>
      </div>
    )}

  return (
    <div className="folder-sidebar">

      {/* CATEGORIES */}
      <div className="sidebar-section-label" style={{ marginTop: "4px", marginBottom: "6px" }}>Categories</div>

      <div
        className={`folder-item ${activeCategory === "all" ? "active" : ""}`}
        onClick={() => onSelectCategory("all")}
      >
        <span>📋 All notes</span>
        <span className="folder-count">{notes.length}</span>
      </div>

      {pinnedCount > 0 && (
        <div
          className={`folder-item ${activeCategory === "pinned" ? "active" : ""}`}
          onClick={() => onSelectCategory("pinned")}
        >
          <span>📌 Pinned</span>
          <span className="folder-count">{pinnedCount}</span>
        </div>
      )}

      {Object.entries(tagCounts).map(([tag, count]) => (
        <div
          key={tag}
          className={`folder-item ${activeCategory === tag ? "active" : ""}`}
          onClick={() => onSelectCategory(tag)}
        >
          <span>🏷️ {tag}</span>
          <span className="folder-count">{count}</span>
        </div>
      ))}

      <hr style={{ borderColor: "var(--border)", margin: "8px 0" }} />

      {/* FOLDERS */}
      <div className="folder-header">
        <span className="sidebar-section-label">Folders</span>
        <button className="folder-add-btn" onClick={() => setShowInput(!showInput)} title="New folder">+</button>
      </div>

      {showInput && (
        <div className="folder-input-row">
          <input
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
            style={{ fontSize: "13px", padding: "6px 8px" }}
          />
          <button className="edit-btn" onClick={handleCreate}>Add</button>
        </div>
      )}

      {folders.length === 0 && (
        <p style={{ fontSize: "12px", color: "var(--text-muted)", padding: "4px 10px" }}>No folders yet.</p>
      )}

      {folders.map((folder) => (
        <div
          key={folder.id}
          className={`folder-item ${activeFolderId === folder.id ? "active" : ""}`}
        >
          {renamingId === folder.id ? (
            <div className="folder-input-row" onClick={(e) => e.stopPropagation()}>
              <input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRename(folder.id)}
                autoFocus
                style={{ fontSize: "13px", padding: "6px 8px" }}
              />
              <button className="edit-btn" onClick={() => handleRename(folder.id)}>Save</button>
            </div>
          ) : (
            <div className="folder-item-row" onClick={() => onSelectFolder(folder.id)}>
              <span>📁 {folder.name}</span>
              <div className="folder-actions">
                <button
                  className="folder-action-btn"
                  onClick={(e) => { e.stopPropagation(); setRenamingId(folder.id); setRenameValue(folder.name); }}
                  title="Rename"
                >✏️</button>
                <button
                  className="folder-action-btn"
                  onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }}
                  title="Delete"
                >🗑️</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FolderSidebar;