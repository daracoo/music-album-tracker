import express from "express";
import cors from "cors";
import { PrismaClient } from "../generated/prisma/client.js";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/albums", async (req, res) => {
  const albums = await prisma.album.findMany();
  res.json(albums);
});


app.post("/albums", async (req, res) => {
  const { title, artist, genre, status, rating } = req.body;

  if (!title || !artist || !genre || !status) {
    return res
      .status(400)
      .json({ error: "Title, artist, genre, and status are required fields." });
  }

  if (rating !== undefined && rating !== null) {
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "Rating must be a number between 1 and 5." });
    }
  }

  try {
    const album = await prisma.album.create({
      data: { 
        title, 
        artist, 
        genre, 
        status, 
        ...(rating !== null && rating !== undefined && { rating })
      },
    });
    res.json(album);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.patch("/albums/:id", async (req, res) => {
  const { id } = req.params;
  const data = {};
  const { title, artist, genre, status, rating } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === "") {
      return res.status(400).json({ error: "Title cannot be empty." });
    }
    data.title = title.trim();
  }

  if (artist !== undefined) {
    if (typeof artist !== 'string' || artist.trim() === "") {
      return res.status(400).json({ error: "Artist cannot be empty." });
    }
    data.artist = artist.trim();
  }

  if (genre !== undefined) {
    if (typeof genre !== 'string' || genre.trim() === "") {
      return res.status(400).json({ error: "Genre cannot be empty." });
    }
    data.genre = genre.trim();
  }

  if (status !== undefined) {
    const validStatuses = ['TO_LISTEN', 'LISTENING', 'LISTENED'];
    if (typeof status !== 'string' || !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }
    data.status = status;
  }

  if (rating !== undefined) {
    if (rating === null) {
      data.rating = null;
    } else if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "Rating must be a number between 1 and 5, or null to clear." });
    } else {
      data.rating = rating;
    }
  }

  if (Object.keys(data).length === 0) {
    return res
      .status(400)
      .json({ error: "No valid fields provided for update." });
  }

  try {
    const album = await prisma.album.update({
      where: { id: Number(id) },
      data,
    });
    res.json(album);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.delete("/albums/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.album.delete({ where: { id: Number(id) } });
  res.json({ message: "Album deleted" });
});

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
