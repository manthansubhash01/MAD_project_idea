const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createNote,
  getNotes,
  getNotesByID,
  updateNote,
  editNoteNyId,
} = require("../controllers/noteController");
const authMiddleware = require("../middleware/authmiddleware");

router.use(authMiddleware);

router.post("/", createNote);

router.get("/", getNotes);

router.get("/:id", getNotesByID);

router.put("/:id", updateNote);

router.patch("/:id", editNoteNyId);

// router.delete('/note/:id',deleteNote)

module.exports = router;
