const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 3001;

// Middleware
app.use(cors()); // Allows requests from React frontend
app.use(express.json()); // Parses JSON bodies

// In-memory storage (replace with database in production)
let todos = [
  { id: 1, title: 'Learn Node.js', completed: false, userId: 1 },
  { id: 2, title: 'Build API', completed: false, userId: 1 }
];
let nextId = 3;

// Get all todos
app.get('/todos', (req, res) => {
  const limit = parseInt(req.query._limit) || todos.length;
  res.json(todos.slice(0, limit));
});

// Get single todo
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.json(todo);
});

// Create todo
app.post('/todos', (req, res) => {
  const newTodo = {
    id: nextId++,
    title: req.body.title,
    completed: req.body.completed || false,
    userId: req.body.userId || 1
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update todo
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  
  if (index === -1) return res.status(404).json({ message: 'Todo not found' });
  
  todos[index] = {
    ...todos[index],
    ...req.body,
    id: id // Prevent ID from being updated
  };
  res.json(todos[index]);
});

// Delete todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter(t => t.id !== id);
  
  if (todos.length === initialLength) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});