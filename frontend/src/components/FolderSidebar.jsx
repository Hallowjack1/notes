import { useState } from "react";

function FolderSidebar({ folders, activeFolderId, onSelectFolder, onCreateFolder, onRenameFolder, onDeleteFolder }) {
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

  return (
    <div className="folder-sidebar">
      <div className="folder-header">
        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>Folders</span>
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

      <div
        className={`folder-item ${activeFolderId === null ? "active" : ""}`}
        onClick={() => onSelectFolder(null)}
      >
        📋 All notes
      </div>

      {folders.map((folder) => (
        <div key={folder.id} className={`folder-item ${activeFolderId === folder.id ? "active" : ""}`}>
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