const Task = require('../models/Task')
const mongoose = require('mongoose');

const getTask = async (req, res) => {
    try {
        const userId = req.user.id
        const tasks = await Task.find({userId: new mongoose.Types.ObjectId(userId)}).sort({ createdAt: -1 });
        res.json(tasks)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const createTask = async(req,res) => {
    try {
        const { title, description, priority, isCompleted } = req.body;
        const userId = req.user.id;

        const task = new Task({ title, description, priority, isCompleted, userId });
        await task.save();
        res.status(201).json(task)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const updateTask = async(req,res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const deleteTask = async(req,res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted" })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getTask,
    createTask,
    updateTask,
    deleteTask
}