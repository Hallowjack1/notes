import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

function DeleteAccountModal({ userId, onDeleted, onClose }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    setError("");

    const res = await fetch(`${API}/delete-account.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, password }),
    });

    const data = await res.json();

    if (data.success) {
      onDeleted();
    } else {
      setError(data.message);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h3>Delete account</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            This will permanently delete your account and all your notes. This cannot be undone.
          </p>

          {!confirming ? (
            <button
              style={{ background: "#e74c3c", marginTop: "8px" }}
              onClick={() => setConfirming(true)}
            >
              I understand, continue
            </button>
          ) : (
            <>
              {error && <p className="error">{error}</p>}
              <input
                type="password"
                placeholder="Enter your password to confirm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}
        </div>

        {confirming && (
          <div className="modal-footer">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button
              style={{ flex: 1, background: "#e74c3c", color: "white", border: "none", borderRadius: "8px", padding: "9px", fontSize: "14px", cursor: "pointer" }}
              onClick={handleDelete}
            >
              Delete my account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeleteAccountModal;