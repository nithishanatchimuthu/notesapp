import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";

const app = express();
const PORT = 5000; 

app.use(cors()); 
 
let notes = [];

app.get("/notes", (req, res) => {
  res.json(notes);
});

app.post("/notes", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  const date = new Date();
  const newNote = {
    id: nanoid(),
    text,
    date: date.toLocaleDateString(),
  };
  notes.push(newNote);
  res.status(201).json(newNote);
});

app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  notes = notes.filter((note) => note.id !== id);
  res.json({ message: "Note deleted successfully" });
}
);
app.listen(5000, () => { 
  console.log('Server running on localhost:5000');
}
);


