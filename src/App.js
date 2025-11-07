
import { useState, useEffect } from "react";
import NotesList from "./components/NotesList";
import Search from "./components/Search";
import Header from "./components/Header";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [aiSearchResults, setAiSearchResults] = useState([]);

  
  useEffect(() => {
    fetch("http://localhost:5000/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  
  const addNote = (text) => {
    fetch("http://localhost:5000/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((newNote) => setNotes((prevNotes) => [...prevNotes, newNote]))
      .catch((err) => console.error("Error adding note:", err));
  };

 
  const handleUpdateNote = (id, newText) => {
    fetch(`http://localhost:5000/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    })
      .then((res) => res.json())
      .then((updatedNote) => {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === Number(id) ? updatedNote : note
          )
        );
      })
      .catch((err) => console.error("Error updating note:", err));
  };

 
  const deleteNote = (id) => {
    fetch(`http://localhost:5000/notes/${id}`, { method: "DELETE" })
      .then(() => setNotes(notes.filter((note) => note.id !== id)))
      .catch((err) => console.error("Error deleting note:", err));
  };

  
  const handleSearchNote = (text) => {
    setSearchText(text);

    if (!text.trim()) {
      setAiSearchResults([]);
      return;
    }

    fetch("http://localhost:5000/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: text }),
    })
      .then((res) => res.json())
      .then((data) => setAiSearchResults(data))
      .catch((err) => console.error("AI Search Error:", err));
  };

  
const displayedNotes = searchText
  ? aiSearchResults.map(result => ({
      id: result.id,
      text: result.text,
      date: new Date().toISOString() 
    }))
  : notes;


  return (
    <div className="container">
      <Header />
      <Search handleSearchNote={handleSearchNote} />
      <NotesList
        notes={displayedNotes}
        handleAddNote={addNote}
        handleDeleteNote={deleteNote}
        handleUpdateNote={handleUpdateNote}
      />
    </div>
  );
};

export default App;


