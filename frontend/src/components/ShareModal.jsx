import { useState } from "react";

function ShareModal({ note, userId, onClose }) {
  const [token, setToken] = useState(note.share_token || null);
  const [copied, setCopied] = useState(false);

  const shareUrl = token ? `${window.location.origin}?share=${token}` : null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleGenerate = async () => {
    const res = await fetch("http://localhost/notes/backend/api/share.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: note.id, user_id: userId, action: "generate" }),
    });
    const data = await res.json();
    if (data.success) setToken(data.token);
  };

  const handleRevoke = async () => {
    await fetch("http://localhost/notes/backend/api/share.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: note.id, user_id: userId, action: "revoke" }),
    });
    setToken(null);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" style={{ maxWidth: "400px" }}>
        <div className="modal-header">
          <h3>Share note</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            <strong>{note.title}</strong>
          </p>

          {!token ? (
            <>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                Generate a public link so anyone can view this note without logging in.
              </p>
              <button onClick={handleGenerate} style={{ marginTop: "8px" }}>
                Generate share link
              </button>
            </>
          ) : (
            <>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                Anyone with this link can view the note.
              </p>
              <div className="share-link-row">
                <input
                  readOnly
                  value={shareUrl}
                  style={{ fontSize: "12px" }}
                  onClick={(e) => e.target.select()}
                />
                <button className="edit-btn" onClick={handleCopy} style={{ whiteSpace: "nowrap", width: "auto" }}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <button
                onClick={handleRevoke}
                style={{ background: "none", border: "0.5px solid #e74c3c", color: "#e74c3c", marginTop: "8px" }}
              >
                Revoke link
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShareModal;