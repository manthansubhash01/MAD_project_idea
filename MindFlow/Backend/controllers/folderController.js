const Folder = require('../models/Folder')
const Note = require('../models/Note')
const mongoose = require('mongoose');

const createFolder = async (req, res) => {
    try{
        let {name , description} = req.body
        const userId = req.user.id

        if(!name){
            name = 'Untitled'
        }
        const folder = await Folder.create({name, description, userId})
        return res.status(201).json(folder)

    }catch(err){
        console.log(err)
        return res.status(500).json({Error : err.message})
    }
}

const getAllFolder = async (req, res) => {
    try{
        const userId = req.user.id

        const folders = await Folder.find({userId : new mongoose.Types.ObjectId(userId)}).sort({createdAt : -1})
        return res.json(folders)
    }catch(err){
        console.log(err)
        return res.status(500).json({Error : err})
    }
}

const getFolderById = async (req, res) => {
    try{
        const folderId = req.params.id?.trim();
        const userId = req.user.id

        if (!mongoose.Types.ObjectId.isValid(folderId)) {
            return res.status(400).json({ Error: "Invalid folderId" });
        }

        const folder = await Folder.findOne({ _id: new mongoose.Types.ObjectId(folderId), userId : new mongoose.Types.ObjectId(userId) })

        if (!folder) {
            return res.status(404).json({ Error: "Folder not found or not authorized" });
        }

        return res.json(folder)
    }catch(err){
        console.log(err)
        return res.status(500).json({Error : err})
    }
}

const updateFolder = async (req, res) => {
    try{
        const folderId = req.params.id?.trim();
        const userId = req.user.id
        
        if (!mongoose.Types.ObjectId.isValid(folderId)) {
            console.log(folderId)
            return res.status(400).json({ Error: "Invalid folderId" });
        }


        const folder = await Folder.findOneAndUpdate(
            {_id : new mongoose.Types.ObjectId(folderId), userId : new mongoose.Types.ObjectId(userId)},
            req.body,
            { new: true }
        )

        if(!folder){
            console.log(folder)
            return res.status(400).json({Error : 'Folder is not found or not authorized'})
        }

        return res.json(folder)

    }catch(err){
        console.log(err)
        return res.status(500).json({Error : err})
    }
}

const deleteFolder = async (req, res) => {
    try{
        const folderId = req.params.id?.trim();
        const userId = req.user.id

        if (!mongoose.Types.ObjectId.isValid(folderId)) {
            return res.status(400).json({ Error: "Invalid folderId" });
        }

        const folder = await Folder.findOneAndDelete({_id : new mongoose.Types.ObjectId(folderId), userId : new mongoose.Types.ObjectId(userId)})

        if(!folder){
            return res.status(400).json({Error : 'Folder is not found or not authorized'})
        }

        await Note.deleteMany({folderId : folderId})

        return res.json({ message: "Folder and related notes deleted" })

    }catch(err){
        console.log(err)
        return res.status(500).json({Error : err})
    }
}

module.exports = {
    createFolder,
    getAllFolder,
    getFolderById,
    updateFolder,
    deleteFolder
}