import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // --- VIEW / READ ---
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- CREATE & UPDATE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    try {
      if (editingId) {
        // Update
        await axios.put(`${baseURL}/api/tasks/${editingId}`, { title, description });
        alert("Task updated successfully!");
      } else {
        // Create
        await axios.post(`${baseURL}/api/tasks`, { title, description });
        alert("Task created successfully!");
      }
      setTitle("");
      setDescription("");
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      console.error("Error saving task", err);
    }
  };

  // Setup form for editing an existing item
  const handleEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description || "");
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${baseURL}/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-slate-900 text-white rounded-2xl shadow-xl mt-10">
      <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Task" : "Create New Task"}</h2>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Task Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
        />
        <textarea
          placeholder="Task Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 rounded-lg font-bold transition">
          {editingId ? "Update Task" : "Create Task"}
        </button>
      </form>

      {/* Task List (View) */}
      <div className="mt-6 space-y-3">
        <h3 className="font-bold text-lg border-b border-slate-800 pb-2">Your Tasks</h3>
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-400">No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="bg-slate-800 p-3.5 rounded-xl flex justify-between items-center border border-slate-700">
              <div>
                <h4 className="font-bold">{task.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{task.description}</p>
              </div>
              <div className="space-x-3 text-xs">
                <button onClick={() => handleEdit(task)} className="text-yellow-400 font-bold hover:underline">Edit</button>
                <button onClick={() => handleDelete(task._id)} className="text-red-400 font-bold hover:underline">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}