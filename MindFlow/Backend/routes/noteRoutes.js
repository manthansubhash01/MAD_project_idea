const express = require('express')
const router = express.Router({ mergeParams: true })
const { createNote, getNotes,getNotesByID, updateNote, editNoteNyId} = require('../controllers/noteController')
const authMiddleware = require('../middleware/authmiddleware')

router.use(authMiddleware)

router.post('/note',createNote)

router.get('/note',getNotes)

router.get('/note/:id',getNotesByID)

router.put('/note/:id',updateNote)

router.patch('/note/:id',editNoteNyId)

// router.delete('/note/:id',deleteNote)

module.exports = router