import { Router } from "express";
// import { Note } from "../models/note.js";
import { createNote, deleteNote, getNoteByID, getNotes, updateNote } from "../controlers/notesController.js";

const router = Router();
router.get("/notes", getNotes);
router.get("/notes/:noteId", getNoteByID);
router.post("/notes", createNote);
router.delete("/notes/:noteId", deleteNote);
router.patch("/notes/:noteId", updateNote);
export default router;
