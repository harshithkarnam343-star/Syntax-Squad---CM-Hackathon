import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";

function App() {
  const [folder, setFolder] = useState("");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);

    if (savedNotes.length > 0) {
      setSelected(savedNotes[0]);
    }
  }, []);

  const saveNote = () => {
    if (!folder.trim() || !link.trim()) {
      alert("Please enter folder name and link");
      return;
    }

    const newNote = {
      id: Date.now(),
      folder,
      link,
    };

    const updatedNotes = [...notes, newNote];

    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    setSelected(newNote);

    setFolder("");
    setLink("");
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);

    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    if (selected?.id === id) {
      setSelected(updatedNotes[0] || null);
    }
  };

  return (
    <div className="container">
      <h1>Smart QR Notes Sharing Platform</h1>

      <p className="subtitle">
        Scan once, access notes instantly
      </p>

      <input
        type="text"
        placeholder="Folder Name"
        value={folder}
        onChange={(e) => setFolder(e.target.value)}
      />

      <input
        type="text"
        placeholder="Paste Google Drive or PDF link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      <button onClick={saveNote}>
        Save Note
      </button>

      <h2>My Notes</h2>

      <div className="notes-list">
        {notes.map((note) => (
          <div className="note-card" key={note.id}>
            <span onClick={() => setSelected(note)}>
              📁 {note.folder}
            </span>

            <button
              className="delete-btn"
              onClick={() => deleteNote(note.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="qr-section">
          <h3>{selected.folder}</h3>

          <QRCodeCanvas
            value={selected.link}
            size={250}
            includeMargin={true}
            level="H"
          />

          <a
            href={selected.link}
            target="_blank"
            rel="noreferrer"
          >
            Open Notes
          </a>
        </div>
      )}
    </div>
  );
}

export default App;