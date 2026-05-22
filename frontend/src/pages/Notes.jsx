import { useState, useEffect } from "react";
import EditModal from "../components/EditModal";
import DarkToggle from "../components/DarkToggle";
import ChangePasswordModal from "../components/ChangePasswordModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import TrashModal from "../components/TrashModal";
import FolderSidebar from "../components/FolderSidebar";
import useReminders from "../hooks/useReminders";
import ExportModal from "../components/ExportModal";
import RichEditor from "../components/RichEditor";
import ShareModal from "../components/ShareModal";
import ImageUpload from "../components/ImageUpload";

const TAGS = ["Personal", "Work", "Ideas", "School", "Other"];

function Notes({ userId, username, onLogout, isDark, onToggleDark }) {
  const [notes, setNotes] = useState([]);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [folders, setFolders] = useState([]);
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const NOTES_PER_PAGE = 12;
  const [showExport, setShowExport] = useState(false);
  const [sharingNote, setSharingNote] = useState(null);
  const [image, setImage] = useState(null);

  const fetchNotes = async () => {
    const res = await fetch(`http://localhost/notes/backend/api/notes.php?user_id=${userId}`);
    const data = await res.json();
    setNotes(data);
  };

  const fetchFolders = async () => {
    const res = await fetch(`http://localhost/notes/backend/api/folders.php?user_id=${userId}`);
    const data = await res.json();
    setFolders(data);
  };

    useEffect(() => {
      fetchNotes();
      fetchFolders();
    }, []);

    const firedIds = useReminders(notes);

    useEffect(() => {
      setCurrentPage(1);
    }, [search, activeCategory, activeFolderId]);

    const handleAdd = async (e) => {
      e.preventDefault();
      setError("");
      const res = await fetch("http://localhost/notes/backend/api/notes.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, title, body, tag, folder_id: activeFolderId, image }),
      });
      const data = await res.json();
      if (data.success) {
        setTitle("");
        setBody("");
        setTag("");
        setImage(null);
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

  const handlePin = async (id, currentPinned) => {
  await fetch("http://localhost/notes/backend/api/pin.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, user_id: userId, pinned: currentPinned ? 0 : 1 }),
    });
    fetchNotes();
  };

  const handleEditSave = async (id, editTitle, editBody, editTag, editFolderId, editReminder, editImage) => {
    const res = await fetch("http://localhost/notes/backend/api/update.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        user_id: userId,
        title: editTitle,
        body: editBody,
        tag: editTag,
        folder_id: editFolderId,
        reminder_at: editReminder || null,
        image: editImage,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setEditingNote(null);
      fetchNotes();
    }
  };

  const handleCreateFolder = async (name) => {
    await fetch("http://localhost/notes/backend/api/folders.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", user_id: userId, name }),
    });
    fetchFolders();
  };

  const handleRenameFolder = async (id, name) => {
    await fetch("http://localhost/notes/backend/api/folders.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rename", user_id: userId, id, name }),
    });
    fetchFolders();
  };

  const handleDeleteFolder = async (id) => {
    await fetch("http://localhost/notes/backend/api/folders.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", user_id: userId, id }),
    });
    if (activeFolderId === id) setActiveFolderId(null);
    fetchFolders();
    fetchNotes();
  };

  const handleMoveNote = async (noteId, folderId) => {
    await fetch("http://localhost/notes/backend/api/move-note.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: noteId, user_id: userId, folder_id: folderId }),
    });
    fetchNotes();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { 
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.body.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = activeFolderId === null || note.folder_id == activeFolderId;
    const matchesCategory =
      activeCategory === "all" ||
      (activeCategory === "pinned" && note.pinned == 1) ||
      (activeCategory === "reminders" && note.reminder_at && new Date(note.reminder_at) > new Date()) ||
      note.tag === activeCategory;
    return matchesSearch && matchesFolder && matchesCategory;
  });

  const totalPages = Math.ceil(filteredNotes.length / NOTES_PER_PAGE);
    const paginatedNotes = filteredNotes.slice(
      (currentPage - 1) * NOTES_PER_PAGE,
      currentPage * NOTES_PER_PAGE
    );

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    setActiveFolderId(null);
  };

  const handleSelectFolder = (folderId) => {
    setActiveFolderId(folderId);
    setActiveCategory("all");
  };

  return (
    <>
    {/* Modals */}
    {/* Editing Modal */}
      {editingNote && (
        <EditModal
          note={editingNote}
          folders={folders}
          onSave={handleEditSave}
          onClose={() => setEditingNote(null)}
        />
      )}
    {/* Change password modal */}
      {showChangePassword && (
        <ChangePasswordModal
          userId={userId}
          onClose={() => setShowChangePassword(false)}
        />
      )}

    {/* Delete account modal */}
      {showDeleteAccount && (
        <DeleteAccountModal
          userId={userId}
          onDeleted={onLogout}
          onClose={() => setShowDeleteAccount(false)}
        />
      )}

    {/* Trash modal */}
      {showTrash && (
        <TrashModal 
          userId={userId} 
          onClose={() => setShowTrash(false)} 
          onRestored={fetchNotes}
        />
      )}

    {/* Export modal */}
    {showExport && (
      <ExportModal
        notes={filteredNotes}
        onClose={() => setShowExport(false)}
      />
    )}

    {/* Share modal */}
    {sharingNote && (
      <ShareModal
        note={sharingNote}
        userId={userId}
        onClose={() => { setSharingNote(null); fetchNotes(); }}
      />
    )}
      
      <div className="app-layout">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <h3>New note</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <RichEditor
              value={body}
              onChange={(val) => {
                if (val.replace(/<[^>]*>/g, "").length <= 500) setBody(val);
              }}
              placeholder="Write your note..."
              rows={5}
            />
            <div style={{ 
                fontSize: "12px", 
                textAlign: "right",
                paddingRight: "8px", 
                color: body.replace(/<[^>]*>/g, "").length > 450 ? "#e74c3c" : "var(--text-muted)", 
                position: "relative",
                zIndex: 9999,
                marginTop: "4px"
            }}>
              {body.replace(/<[^>]*>/g, "").length}/500
            </div>
            <select value={tag} onChange={(e) => setTag(e.target.value)}>
              <option value="">No tag</option>
              {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={activeFolderId || ""} onChange={(e) => setActiveFolderId(e.target.value || null)}>
              <option value="">No folder</option>
              {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <button type="submit">Add Note</button>
          </form>

          <hr style={{ borderColor: "var(--border)" }} />

          <FolderSidebar
            folders={folders}
            activeFolderId={activeFolderId}
            activeCategory={activeCategory}
            notes={notes}
            onSelectFolder={handleSelectFolder}
            onSelectCategory={handleSelectCategory}
            onCreateFolder={handleCreateFolder}
            onRenameFolder={handleRenameFolder}
            onDeleteFolder={handleDeleteFolder}
          />

          <ImageUpload
            currentImage={image}
            onUploaded={(filename) => setImage(filename)}
            onRemove={() => setImage(null)}
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="top-bar">
  
            <h2>
              {activeFolderId
                ? folders.find((f) => f.id == activeFolderId)?.name
                : activeCategory === "all"
                ? "My Notes"
                : activeCategory === "pinned"
                ? "Pinned"
                : activeCategory}
            </h2>            
            <div className="top-bar-right">
              <DarkToggle isDark={isDark} onToggle={onToggleDark} />
              <a onClick={() => setShowChangePassword(true)}>Settings</a>
              <a onClick={() => setShowTrash(true)}>Trash</a>
              <a onClick={() => setShowExport(true)}>Export</a>
              <a onClick={() => setShowDeleteAccount(true)} style={{ color: "#e74c3c" }}>Delete account</a>
              <a onClick={onLogout}>Logout</a>
            </div>
          </div>

          <input placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} />

          {filteredNotes.length === 0 ? (
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              {search || activeCategory !== "all" ? "No notes match your filter." : "No notes yet. Add one on the left!"}
            </p>
          ) : (
            <>
              <div className="notes-grid">
                {paginatedNotes.map((note) => (
                  <div className="note-card" key={note.id} style={{ border: note.pinned == 1 ? "0.5px solid #4a90e2" : "" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {note.tag && <span className="tag-badge">{note.tag}</span>}
                      <button className="pin-btn" onClick={() => handlePin(note.id, note.pinned)} title={note.pinned ? "Unpin" : "Pin"}>
                        {note.pinned == 1 ? "📌" : "📍"}
                      </button>
                    </div>
                    <h4>{note.title}</h4>
                    <p dangerouslySetInnerHTML={{ __html: note.body }} />
                    
                    {note.image && (
                      <img
                        src={`http://localhost/notes/backend/uploads/${note.image}`}
                        alt="attachment"
                        className="note-image"
                      />
                    )}
                    
                    {note.folder_id && (
                      <small style={{ color: "var(--text-muted)" }}>
                        📁 {folders.find(f => f.id == note.folder_id)?.name}
                      </small>
                    )}
                    {note.reminder_at && (
                      <small style={{
                        fontSize: "11px",
                        color: firedIds.has(note.id) ? "#27ae60" : "#4a90e2",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        {firedIds.has(note.id) ? "✅ Reminder done" : `🔔 ${new Date(note.reminder_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`}
                      </small>
                    )}
                    <div className="note-footer">
                      <small>{formatDate(note.created_at)}</small>
                      <div className="note-actions">
                        <button className="edit-btn" onClick={() => setEditingNote(note)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(note.id)}>Delete</button>
                        <button className="edit-btn" onClick={() => setSharingNote(note)}>Share</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    title="First page"
                  >
                    «
                  </button>

                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    ← Prev
                  </button>

                  <div className="page-numbers">
                    {(() => {
                      const pages = [];
                      const delta = 2;
                      const left = currentPage - delta;
                      const right = currentPage + delta;

                      let lastPage = null;

                      for (let i = 1; i <= totalPages; i++) {
                        if (i === 1 || i === totalPages || (i >= left && i <= right)) {
                          if (lastPage && i - lastPage > 1) {
                            pages.push(<span key={`ellipsis-${i}`} className="page-ellipsis">...</span>);
                          }
                          pages.push(
                            <button
                              key={i}
                              className={`page-num ${currentPage === i ? "active" : ""}`}
                              onClick={() => setCurrentPage(i)}
                            >
                              {i}
                            </button>
                          );
                          lastPage = i;
                        }
                      }
                      return pages;
                    })()}
                  </div>

                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>

                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    title="Last page"
                  >
                    »
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Notes;