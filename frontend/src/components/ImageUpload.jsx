import { useState } from "react";

const API = import.meta.env.VITE_API_URL;
const BASE = API.replace('/api', '');

function ImageUpload({ currentImage, onUploaded, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost/notes/backend/api/upload.php", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (data.success) {
      onUploaded(data.filename);
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="image-upload">
      {error && <p className="error" style={{ fontSize: "12px" }}>{error}</p>}

      {currentImage ? (
        <div className="image-preview">
          <img
            src={`${BASE}/uploads/${currentImage}`}
            alt="Note attachment"
          />
          <button className="delete-btn" onClick={onRemove} style={{ width: "auto", marginTop: "6px" }}>
            Remove image
          </button>
        </div>
      ) : (
        <label className="image-upload-label">
          {uploading ? "Uploading..." : "📎 Attach image"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{ display: "none" }}
          />
        </label>
      )}
    </div>
  );
}

export default ImageUpload;