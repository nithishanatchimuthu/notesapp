import Note from './Note';
import AddNote from './AddNote';

const NotesList = ({ notes, handleAddNote, handleDeleteNote, handleUpdateNote,handleSearchNote }) => {
  return (
    <div className='notes-list'>
      {notes.map((note) => (
        <Note
        
          id={note.id}
          text={note.text}
          date={note.date}
          handleDeleteNote={handleDeleteNote}
          handleUpdateNote={handleUpdateNote}
          handleSearchNote={handleSearchNote}
        />
      ))}
      <AddNote handleAddNote={handleAddNote} />
    </div>
  );
};

export default NotesList;

