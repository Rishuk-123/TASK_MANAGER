const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { 
      type: String, 
      enum: ['Todo', 'In Progress', 'Completed'], 
      default: 'Todo' 
    },
    priority: { 
      type: String, 
      enum: ['Low', 'Medium', 'High'], 
      default: 'Medium' 
    },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ title: 'text' });

module.exports = mongoose.model('Task', taskSchema);