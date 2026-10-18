const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// 1. CREATE
router.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json({ success: true, newTask });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. VIEW / READ ALL
router.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. UPDATE
router.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, updatedTask });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. DELETE
router.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;