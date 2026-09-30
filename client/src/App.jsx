import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit3, CheckCircle2, Clock, AlertCircle, 
  Search, Filter, LayoutGrid, List, BarChart3, Database, 
  Sparkles, X, ChevronRight, Check, ShieldCheck
} from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState([
    {
      _id: '1',
      title: 'Architect MongoDB Schema & Indexes',
      description: 'Implement compound indexing on {status: 1, priority: 1} to optimize query times.',
      status: 'Completed',
      priority: 'High',
      dueDate: '2026-10-05',
      subtasks: [{ id: 1, text: 'Schema design', done: true }, { id: 2, text: 'Add indexing', done: true }]
    },
    {
      _id: '2',
      title: 'Build Express RESTful API Endpoints',
      description: 'Engineered secure endpoints with express-validator middleware for input validation.',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2026-10-12',
      subtasks: [{ id: 1, text: 'GET /api/tasks', done: true }, { id: 2, text: 'POST validation middleware', done: false }]
    },
    {
      _id: '3',
      title: 'Design Kanban Board & Responsive UI',
      description: 'Utilize Tailwind CSS to create custom cards with priority badges and smooth state updates.',
      status: 'Todo',
      priority: 'Medium',
      dueDate: '2026-10-20',
      subtasks: [{ id: 1, text: 'Grid layout', done: true }, { id: 2, text: 'Drag state tracking', done: false }]
    }
  ]);

  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban', 'list', 'analytics'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0]
  });

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'Todo',
        priority: 'Medium',
        dueDate: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      setTasks(tasks.map(t => t._id === editingTask._id ? { ...t, ...formData } : t));
    } else {
      const newTask = {
        _id: Date.now().toString(),
        ...formData,
        subtasks: []
      };
      setTasks([newTask, ...tasks]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t._id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus } : t));
  };

  // Helper styles
  const getPriorityBadge = (p) => {
    switch (p) {
      case 'High': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              TaskFlow Pro
            </h1>
            <p className="text-xs text-slate-400">Full Stack MERN Operations Platform</p>
          </div>
        </div>

        {/* View Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'kanban' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Kanban
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'list' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" /> List View
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Analytics
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-indigo-600/25"
        >
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" /> Priority Filter:
            </div>
            {['All', 'High', 'Medium', 'Low'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                  selectedPriority === p
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Kanban Board View */}
        {activeTab === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Todo', 'In Progress', 'Completed'].map((columnStatus) => {
              const colTasks = filteredTasks.filter(t => t.status === columnStatus);
              return (
                <div key={columnStatus} className="bg-slate-900/50 rounded-2xl border border-slate-800/80 p-4 flex flex-col min-h-[500px]">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        columnStatus === 'Todo' ? 'bg-amber-400' :
                        columnStatus === 'In Progress' ? 'bg-indigo-400' : 'bg-emerald-400'
                      }`} />
                      <h2 className="font-semibold text-slate-200">{columnStatus}</h2>
                    </div>
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {colTasks.map((task) => (
                      <div
                        key={task._id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition shadow-sm group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadge(task.priority)}`}>
                            {task.priority}
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                            <button onClick={() => handleOpenModal(task)} className="p-1 hover:text-indigo-400 text-slate-400">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteTask(task._id)} className="p-1 hover:text-rose-400 text-slate-400">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-medium text-slate-100 text-sm mb-1">{task.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">{task.description}</p>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {task.dueDate}
                          </span>
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            className="bg-slate-950 text-slate-300 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] focus:outline-none"
                          >
                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {activeTab === 'list' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Task Title</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4 font-medium text-slate-200">
                      <div>{task.title}</div>
                      <div className="text-xs text-slate-400 truncate max-w-md">{task.description}</div>
                    </td>
                    <td className="p-4">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none"
                      >
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">{task.dueDate}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleOpenModal(task)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteTask(task._id)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="text-xs text-slate-400 font-medium mb-1">Total Tasks</div>
              <div className="text-3xl font-bold text-white">{tasks.length}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="text-xs text-slate-400 font-medium mb-1">Completed Tasks</div>
              <div className="text-3xl font-bold text-emerald-400">
                {tasks.filter(t => t.status === 'Completed').length}
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="text-xs text-slate-400 font-medium mb-1">Completion Rate</div>
              <div className="text-3xl font-bold text-indigo-400">
                {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100) : 0}%
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}