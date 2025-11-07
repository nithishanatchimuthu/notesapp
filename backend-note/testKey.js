import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function testKey() {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: "Hello world",
    });
    console.log(" Key is valid! Embedding length:", response.data[0].embedding.length);
  } catch (err) {
    console.error(" Error testing API key:", err.message || err);
  }
}

testKey();
