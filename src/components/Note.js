import { MdDeleteForever } from "react-icons/md";
import React, { useState } from "react";

const Note = ({ id, text, date, handleDeleteNote, handleUpdateNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(text);

  const startEditing = () => setIsEditing(true);

  const stopEditing = () => {
    setIsEditing(false);
    const trimmedText = newText.trim();
    if (trimmedText && trimmedText !== text) {
      handleUpdateNote(id, trimmedText);
    } else {
      setNewText(text); 
    }
  };

  const content = isEditing ? (
    <input
      value={newText}
      onChange={(e) => setNewText(e.target.value)}
      onBlur={stopEditing}
      onKeyDown={(e) => e.key === "Enter" && stopEditing()}
      autoFocus
    />
  ) : (
    <span onClick={startEditing}>{newText}</span>
  );

  return (
    <div className="note">
      {content}
      <div className="note-footer">
        <small>{date}</small>
        <MdDeleteForever
          onClick={() => handleDeleteNote(id)}
          className="delete-icon"
          size="1.3em"
        />
      </div>
    </div>
  );
};

export default Note;
