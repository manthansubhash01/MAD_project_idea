const Note = require("../models/Note");
const Folder = require("../models/Folder");
const mongoose = require("mongoose");

const createNote = async (req, res) => {
  try {
    let { title } = req.body;
    const folderId = req.params.folderId; // Get from route params
    const userId = req.user.id;

    if (!title) title = "Untitled";

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ Error: "Invalid folderId" });
    }

    const folder = await Folder.findOne({ _id: folderId, userId });
    if (!folder) return res.status(404).json({ Error: "Folder not found" });

    const note = await Note.create({ title, blocks: [], folderId, userId });
    return res.status(201).json(note);
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const userId = req.user.id;

    console.log(req.params);
    console.log(folderId);
    const notes = await Note.find({
      folderId: new mongoose.Types.ObjectId(folderId),
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    console.log(notes);
    return res.json(notes);
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

const getNotesByID = async (req, res) => {
  try {
    const noteId = req.params.id?.trim();
    const folderId = req.params.folderId;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ Error: "Invalid noteId" });
    }

    const note = await Note.findOne({
      _id: noteId,
      folderId: folderId,
      userId: userId,
    });

    if (!note) {
      return res
        .status(400)
        .json({ Error: "Note not found or not authorized" });
    }

    return res.json(note);
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id?.trim();
    const folderId = req.params.folderId;
    const userId = req.user.id;
    const { blocks, content, title } = req.body;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ Error: "Invalid noteId" });
    }

    // Build update object with only provided fields
    const updateData = { updatedAt: new Date() };
    if (blocks !== undefined) updateData.blocks = blocks;
    if (content !== undefined) updateData.content = content;
    if (title !== undefined) updateData.title = title;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, folderId: folderId, userId: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res
        .status(404)
        .json({ Error: "Note not found or not authorized" });
    }

    return res.json(note);
  } catch (err) {
    console.error("Update note error:", err);
    return res.status(500).json({ Error: err.message });
  }
};

const editNoteNyId = async (req, res) => {
  try {
    const noteId = req.params.id;
    const folderId = req.params.folderId;
    const userId = req.user.id;

    const note = await Note.findOne({
      _id: noteId,
      folderId: folderId,
      userId: userId,
    });

    if (!note) return res.status(404).json({ error: "Not found" });

    const { action } = req.body;

    if (action == "update") {
      const { blockId, updates } = req.body;
      const idx = note.blocks.findIndex((b) => b.id === blockId);
      if (idx === -1) return res.status(404).json({ error: "block not found" });
      note.blocks[idx] = {
        ...note.blocks[idx].toObject(),
        ...updates,
        updatedAt: new Date(),
      };
      note.updatedAt = new Date();
      await note.save();
      return res.json({ block: note.blocks[idx] });
    }

    if (action === "add") {
      const { block, atIndex } = req.body;
      const newBlock = { ...block, updatedAt: new Date() };
      if (
        typeof atIndex === "number" &&
        atIndex >= 0 &&
        atIndex <= note.blocks.length
      ) {
        note.blocks.splice(atIndex, 0, newBlock);
      } else {
        note.blocks.push(newBlock);
      }
      note.updatedAt = new Date();
      await note.save();
      return res.status(201).json({ block: newBlock });
    }

    if (action === "delete") {
      const { blockId } = req.body;
      note.blocks = note.blocks.filter((b) => b.id !== blockId);
      note.updatedAt = new Date();
      await note.save();
      return res.json({ success: true });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id?.trim();
    const folderId = req.params.folderId;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ Error: "Invalid noteId" });
    }

    const note = await Note.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(noteId),
      folderId: folderId,
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!note) {
      return res
        .status(400)
        .json({ Error: "Note is not found or not authorized" });
    }

    return res.json({ message: "Note deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: err });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNotesByID,
  updateNote,
  editNoteNyId,
  deleteNote,
};
