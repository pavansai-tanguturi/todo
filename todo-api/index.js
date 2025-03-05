const express = require('express');
const cors = require('cors');
const fs = require('fs').promises; // Using promises version of fs
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'todos.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initial data (will be overridden by file if it exists)
const initialTodos = [
  { id: 1, title: 'Learn Node.js', completed: false, userId: 1 },
  { id: 2, title: 'Build API', completed: false, userId: 1 }
];

// Helper functions to read and write data
async function loadTodos() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return initial todos
    if (error.code === 'ENOENT') {
      await saveTodos(initialTodos);
      return initialTodos;
    }
    throw error;
  }
}

async function saveTodos(todos) {
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2));
}

async function getNextId(todos) {
  return todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
}

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await loadTodos();
    const limit = parseInt(req.query._limit) || todos.length;
    res.json(todos.slice(0, limit));
  } catch (error) {
    res.status(500).json({ message: 'Error reading todos' });
  }
});

// Get single todo
app.get('/todos/:id', async (req, res) => {
  try {
    const todos = await loadTodos();
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error reading todos' });
  }
});

// Create todo
app.post('/todos', async (req, res) => {
  try {
    const todos = await loadTodos();
    const newTodo = {
      id: await getNextId(todos),
      title: req.body.title,
      completed: req.body.completed || false,
      userId: req.body.userId || 1
    };
    todos.push(newTodo);
    await saveTodos(todos);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating todo' });
  }
});

// Update todo
app.put('/todos/:id', async (req, res) => {
  try {
    const todos = await loadTodos();
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);
    
    if (index === -1) return res.status(404).json({ message: 'Todo not found' });
    
    todos[index] = {
      ...todos[index],
      ...req.body,
      id: id
    };
    await saveTodos(todos);
    res.json(todos[index]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo' });
  }
});

// Delete todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const todos = await loadTodos();
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    const updatedTodos = todos.filter(t => t.id !== id);
    
    if (updatedTodos.length === initialLength) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    await saveTodos(updatedTodos);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

app.patch('/todos/:id', async (req, res) => {
  try {
    const todos = await loadTodos();
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);
    
    if (index === -1) return res.status(404).json({ message: 'Todo not found' });
    
    // Only update the fields that are provided in the request body
    todos[index] = {
      ...todos[index],
      ...(req.body.title !== undefined && { title: req.body.title }),
      ...(req.body.completed !== undefined && { completed: req.body.completed }),
      ...(req.body.userId !== undefined && { userId: req.body.userId })
    };
    await saveTodos(todos);
    res.json(todos[index]);
  } catch (error) {
    res.status(500).json({ message: 'Error patching todo' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});