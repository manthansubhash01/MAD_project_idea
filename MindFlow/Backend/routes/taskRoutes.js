const express = require('express')
const authMiddleware = require('../middleware/authmiddleware')
const { getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController')

const router = express.Router();

router.use(authMiddleware)

router.get("/", getTask);

router.post("/", createTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

module.exports = router