import { useState,useEffect } from "react";
import{nanoid} from 'nanoid';
import NotesList from "./components/NotesList";
import Search from "./components/Search";
import Header from "./components/Header";



const App= () =>{
   const [notes,setNotes]=useState([]);
 

const[searchText,setSearchText]=useState('');


useEffect(() => {
  fetch("http://localhost:5000/notes")
    .then((res) => res.json())
    .then((data) => setNotes(data));
},[]);


const addNote = (text) => {
  fetch("http://localhost:5000/notes", {method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })
    .then((res) => res.json())
    .then((newNote) => setNotes((prevNotes) => [...prevNotes, newNote]))

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
  fetch(`http://localhost:5000/notes/${id}`, 
    { method: "DELETE" })
    .then(() => setNotes(notes.filter((note) => note.id !== id)));
};

  return( 
  <div className='container'>
    <Header/>
    <Search handleSearchNote={setSearchText}/>


   <NotesList
  notes={notes.filter((note) =>
    note.text.toLowerCase().includes(searchText.toLowerCase())
  )}
  handleAddNote={addNote}
  handleDeleteNote={deleteNote}
  handleUpdateNote={handleUpdateNote}
/>

  </div>
  );
 };
export default App;