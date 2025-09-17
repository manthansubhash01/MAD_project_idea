const express = require('express')
const router = express.Router({ mergeParams: true })
const { createNote, getNotes, updateNote, deleteNote,} = require('../controllers/noteController')
const authMiddleware = require('../middleware/authmiddleware')

router.use(authMiddleware)

router.post('/note',createNote)

router.get('/note',getNotes)

router.put('/note/:id',updateNote)

router.delete('/note/:id',deleteNote)

module.exports = router