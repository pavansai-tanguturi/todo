const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (Vercel serverless is stateless; use a database for persistence)
let todos = [
  { id: 1, title: 'Learn Node.js', completed: false, userId: 1 },
  { id: 2, title: 'Build API', completed: false, userId: 1 }
];

function getNextId() {
  return todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
}

// Get all todos
app.get('/api/todos', (req, res) => {
  const limit = parseInt(req.query._limit) || todos.length;
  res.json(todos.slice(0, limit));
});

// Get single todo
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.json(todo);
});

// Create todo
app.post('/api/todos', (req, res) => {
  const newTodo = {
    id: getNextId(),
    title: req.body.title,
    completed: req.body.completed || false,
    userId: req.body.userId || 1
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update todo (PUT)
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: 'Todo not found' });

  todos[index] = { ...todos[index], ...req.body, id };
  res.json(todos[index]);
});

// Patch todo
app.patch('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: 'Todo not found' });

  todos[index] = {
    ...todos[index],
    ...(req.body.title !== undefined && { title: req.body.title }),
    ...(req.body.completed !== undefined && { completed: req.body.completed }),
    ...(req.body.userId !== undefined && { userId: req.body.userId })
  };
  res.json(todos[index]);
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter(t => t.id !== id);
  if (todos.length === initialLength) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  res.status(204).send();
});

// Local development server
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
