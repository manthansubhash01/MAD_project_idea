const express = require('express')
const router = express.Router()
const { createFolder, getAllFolder, getFolderById, updateFolder, deleteFolder } = require('../controllers/folderController')
const authMiddleware = require('../middleware/authmiddleware')

router.use(authMiddleware)

router.post('/folders',createFolder)

router.get('/folders',getAllFolder)

router.get('/folders/:id',getFolderById)

router.put('/folders/:id',updateFolder)

router.delete('/folders/:id',deleteFolder)

module.exports = router