import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "notes_app",
  password: "12345678",
  port: 5432,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


async function generateEmbedding(text) {
  if (!text) return [];
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  } catch (err) {
    console.error(" Error generating embedding:", err.message || err);
    return []; 
  }
}


function jsArrayToPGArray(arr) {
  if (!arr || !arr.length) return "{}";
  return "{" + arr.join(",") + "}";
}


app.get("/notes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notes" });
  }
});


app.post("/notes", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text is required" });

  try {
    const embedding = await generateEmbedding(text);
    const result = await pool.query(
      "INSERT INTO notes (text, embedding) VALUES ($1, $2::double precision[]) RETURNING *",
      [text, jsArrayToPGArray(embedding)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding note" });
  }
});


app.put("/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text is required" });

  try {
    const embedding = await generateEmbedding(text);
    const result = await pool.query(
      "UPDATE notes SET text = $1, embedding = $2::double precision[] WHERE id = $3 RETURNING *",
      [text, jsArrayToPGArray(embedding), id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Note not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating note" });
  }
});


app.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM notes WHERE id = $1", [id]);
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting note" });
  }
});


app.post("/search", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    const queryEmbedding = await generateEmbedding(query);

    const notes = await pool.query(
      "SELECT id, text, embedding FROM notes WHERE embedding IS NOT NULL"
    );

    const notesWithArray = notes.rows.map(note => ({
      ...note,
      embedding: Array.isArray(note.embedding) ? note.embedding.map(Number) : []
    }));

    const similarities = notesWithArray.map(note => ({
      id: note.id,
      text: note.text,
      
      similarity: cosineSimilarity(note.embedding, queryEmbedding)
    }));

    similarities.sort((a, b) => b.similarity - a.similarity);

    res.json(similarities.slice(0, 5));
  } catch (err) {
    console.error("Error during search:", err);
    res.status(500).json({ message: "Error during search" });
  }
});


function cosineSimilarity(a, b) {
  if (!a || !b || a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0; 
  }
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
}); 