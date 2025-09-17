const Note = require('../models/Note')
const mongoose = require('mongoose');

const createNote = async (req, res) => {
    try{
        let { title, content, folderId } = req.body
        const userId = req.user.id
        
        if (!title) {
            title = 'Untitled';
        }

        if (!mongoose.Types.ObjectId.isValid(folderId)) {
            return res.status(400).json({ Error: 'Invalid folderId' });
        }

        const note = await Note.create({ title, content, folderId, userId });
        return res.status(201).json(note);

    }catch(err){
        return res.statu(500).json({Error : err.message})
    }
}

const getNotes = async (req, res) => {
    try{
        const userId = req.user.id

        const notes = await Note.find({userId : new mongoose.Types.ObjectId(userId)}).sort({ createdAt : -1})

        return res.json(notes)

    }catch(err){
        return res.statu(500).json({Error : err.message})
    }
}

const updateNote = async (req, res) => {
    try{
        const noteId = req.params.id?.trim()
        const userId = req.user.id

        if(!mongoose.Types.ObjectId.isValid(noteId)){
            return res.status(400).json({ Error : 'Invalid noteId' })
        }

        const note = await Note.findOneAndUpdate(
            { _id : new mongoose.Types.ObjectId(noteId), userId: new mongoose.Types.ObjectId(userId) },
            req.body,
            { new : true }
        )

        if(!note){
            return res.status(400).json({ Error: 'Note not found or not authorized' })
        }

        return res.json(note)

    }catch(err){
        return res.statu(500).json({Error : err.message})
    }
}

const deleteNote = async (req, res) => {
    try{
        const noteId = req.params.id?.trim()
        const userId = req.user.id

        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({ Error: "Invalid noteId" });
        }

        const note = await Note.findOneAndDelete({_id : new mongoose.Types.ObjectId(noteId), userId : new mongoose.Types.ObjectId(userId)})

        if(!note){
            return res.status(400).json({Error : 'Folder is not found or not authorized'})
        }

        return res.json({ message: "Note deleted" })

    }catch(err){
        console.log(err)
        return res.status(500).json({Error : err})
    }
}

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
};
