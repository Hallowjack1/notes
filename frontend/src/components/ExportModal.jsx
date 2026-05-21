import { useState } from "react";
import { jsPDF } from "jspdf";

function ExportModal({ notes, onClose }) {
  const [selectedIds, setSelectedIds] = useState(new Set(notes.map((n) => n.id)));

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const toggleNote = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSelected = selectedIds.size === notes.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(notes.map((n) => n.id)));
    }
  };

  const selectedNotes = notes.filter((n) => selectedIds.has(n.id));

  const exportTXT = () => {
    if (selectedNotes.length === 0) return;
    const content = selectedNotes.map((note) => {
      return [
        `Title: ${note.title}`,
        `Date: ${new Date(note.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
        note.tag ? `Tag: ${note.tag}` : null,
        ``,
        note.body,
        ``,
        `─────────────────────────`,
        ``
      ].filter((line) => line !== null).join("\n");
    }).join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-notes.txt";
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const exportPDF = () => {
    if (selectedNotes.length === 0) return;
    const doc = new jsPDF();
    let y = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("My Notes", margin, y);
    y += 12;

    selectedNotes.forEach((note, index) => {
      if (y > pageHeight - 40) { doc.addPage(); y = 20; }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(note.title, margin, y);
      y += lineHeight;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(150);
      const date = new Date(note.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      doc.text(note.tag ? `${date} · ${note.tag}` : date, margin, y);
      y += lineHeight;
      doc.setTextColor(0);

      doc.setFontSize(11);
      const lines = doc.splitTextToSize(note.body, 170);
      lines.forEach((line) => {
        if (y > pageHeight - 20) { doc.addPage(); y = 20; }
        doc.text(line, margin, y);
        y += lineHeight;
      });

      if (index < selectedNotes.length - 1) {
        y += 4;
        doc.setDrawColor(220);
        doc.line(margin, y, 190, y);
        y += 8;
      }
    });

    doc.save("my-notes.pdf");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" style={{ maxWidth: "420px" }}>
        <div className="modal-header">
          <h3>Export notes</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="export-header">
            <span className="export-count">{selectedIds.size} of {notes.length} selected</span>
            <button className="edit-btn" onClick={toggleAll} style={{ padding: "4px 10px" }}>
              {allSelected ? "Deselect all" : "Select all"}
            </button>
          </div>

          <div className="export-list">
            {notes.map((note) => (
              <label
                key={note.id}
                className={`export-note-item ${selectedIds.has(note.id) ? "selected" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(note.id)}
                  onChange={() => toggleNote(note.id)}
                  style={{ width: "auto", margin: 0 }}
                />
                <div style={{ overflow: "hidden" }}>
                  <p className="export-note-title">{note.title}</p>
                  <p className="export-note-meta">
                    {new Date(note.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {note.tag ? ` · ${note.tag}` : ""}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <div className="export-actions">
            <button className="export-btn" onClick={exportTXT} disabled={selectedIds.size === 0}>
              📄 Export as TXT
              <p>Plain text file, simple and lightweight</p>
            </button>
            <button className="export-btn" onClick={exportPDF} disabled={selectedIds.size === 0}>
              📑 Export as PDF
              <p>Formatted document, good for sharing</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;