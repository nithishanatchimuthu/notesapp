import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "notes_app",
  password: "12345678", 
  port: 5432,

});



app.get("/notes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes ORDER BY id ASC");
    res.json(result.rows);
  }
   catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notes" });
  }
});




app.post("/notes", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text is required" });

  try {
    const result = await pool.query(
      "INSERT INTO notes (text) VALUES ($1) RETURNING *",
      [text]
    );

    res.status(201).json(result.rows[0]);
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding note" });
  }

});

app.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM notes WHERE id = $1", [id]);

    res.json({ message: "Note deleted successfully" }

    );
  } 
  catch (err) {
    console.error(err);

    res.status(500).json({ message: "Error deleting note" });
  }
});


app.listen(5000, () => {

  console.log('Server running on localhost:5000');
}
);
