import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaTrash, FaPencilAlt, FaCheck, FaTimes, FaPlus, FaSyncAlt, FaSun, FaMoon } from 'react-icons/fa';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [justAddedId, setJustAddedId] = useState(null);
  const [isTogglingAll, setIsTogglingAll] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [theme, setTheme] = useState('default'); // 'default' | 'sunset'
  const [isAddingSample, setIsAddingSample] = useState(false);
  
  const API_URL = 'http://localhost:3001/todos';
  const MIN_LOADING_DURATION = 1000; // 1 second minimum loading time

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const startTime = Date.now();
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}?_limit=5`);
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_DURATION - elapsedTime);
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      setTodos(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching todos:', error);
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_DURATION - elapsedTime);
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await axios.post(API_URL, {
        title,
        completed: false,
        userId: 1
      });
      setTodos([...todos, response.data]);
      setTitle('');
      setJustAddedId(response.data.id);
      setTimeout(() => setJustAddedId(null), 900);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleUpdate = async (todo) => {
    try {
      const response = await axios.put(`${API_URL}/${todo.id}`, {
        ...todo,
        completed: !todo.completed
      });
      setTodos(todos.map(t => t.id === todo.id ? response.data : t));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleEditStart = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const handleEditSave = async (id) => {
    if (!editTitle.trim()) return;

    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        ...todos.find(t => t.id === id),
        title: editTitle
      });
      setTodos(todos.map(t => t.id === id ? response.data : t));
      setEditingId(null);
      setEditTitle('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleAll = async () => {
    if (!todos.length) return;
    const shouldComplete = todos.some(t => !t.completed);
    try {
      setIsTogglingAll(true);
      const updates = todos.map(t => axios.put(`${API_URL}/${t.id}`, { ...t, completed: shouldComplete }));
      const results = await Promise.allSettled(updates);
      const updatedTodos = todos.map((t, idx) => {
        const res = results[idx];
        return res.status === 'fulfilled' ? res.value.data : { ...t, completed: shouldComplete };
      });
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error toggling all todos:', error);
      setTodos(todos.map(t => ({ ...t, completed: shouldComplete })));
    } finally {
      setIsTogglingAll(false);
    }
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(t => t.completed);
    if (!completed.length) return;
    setIsClearing(true);
    try {
      const deletes = completed.map(t => axios.delete(`${API_URL}/${t.id}`));
      await Promise.allSettled(deletes);
      setTodos(todos.filter(t => !t.completed));
    } catch (error) {
      console.error('Error clearing completed todos:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Framer Motion variants
  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.04 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.995 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.36, ease: [0.2,0.9,0.2,1] } },
    removed: { opacity: 0, x: -24, scale: 0.98, height: 0, margin: 0, padding: 0, transition: { duration: 0.28 } }
  };

  const toggleTheme = () => setTheme(prev => prev === 'default' ? 'sunset' : 'default');

  const addSampleTodos = async () => {
    if (isAddingSample) return;
    setIsAddingSample(true);
    try {
      const samples = [
        { title: 'Try the new theme ✨', completed: false, userId: 1 },
        { title: 'Click items to complete ✅', completed: false, userId: 1 },
        { title: 'Use filters to focus 🔎', completed: false, userId: 1 }
      ];
      const created = [];
      for (const s of samples) {
        const res = await axios.post(API_URL, s);
        created.push(res.data);
      }
      setTodos(prev => [...prev, ...created]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingSample(false);
    }
  };

  const EmptyState = () => (
    <motion.div className="empty-state" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>

      <div className="empty-text">No todos yet — add your first task</div>
      <div className="empty-actions">
        <button className="btn" onClick={() => document.querySelector('input[type=text]').focus()}>Add a todo</button>
        <button className="btn active" onClick={addSampleTodos} disabled={isAddingSample}>{isAddingSample ? 'Adding…' : 'Add sample'}</button>
      </div>
    </motion.div>
  );

  return (
    <div className="App">
      <div className={`container ${theme === 'sunset' ? 'theme-sunset' : ''}`}>
        {isLoading ? (
          <>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-form"></div>
            <div className="todo-list">
              {[1, 2, 3].map((n) => (
                <div key={n} className="skeleton skeleton-item"></div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1>Todo List</h1>
            <form onSubmit={handleCreate} className="todo-form">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a new todo"
                className="flex-1 mb-2"
              />
              <button type="submit" className="add-button">
                <FaPlus className="btn-icon" /> ADD
              </button>
            </form>

            <div className="controls mb-2">
              <div className="filters">
                <button type="button" className={`btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                <button type="button" className={`btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active</button>
                <button type="button" className={`btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
              </div>
              <div className="actions-right">
                <button type="button" className="btn" onClick={toggleTheme} aria-label="Toggle theme">
                  {theme === 'sunset' ? <FaMoon /> : <FaSun />}
                </button>
                <button type="button" className="btn ghost" onClick={handleToggleAll} disabled={isTogglingAll}>
                  <FaSyncAlt className="icon-sm" /> {isTogglingAll ? 'Working...' : 'Toggle All'}
                </button>
                <button type="button" className="btn ghost danger" onClick={handleClearCompleted} disabled={isClearing}>
                  Clear Completed
                </button>
              </div>
            </div>

            {filteredTodos.length === 0 ? (
              <EmptyState />
            ) : (
              <motion.div className="todo-list" variants={listVariants} initial="hidden" animate="show" layout>
                <AnimatePresence>
                  {filteredTodos.map(todo => (
                    <motion.div
                      key={todo.id}
                      layout
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="removed"
                      className={`todo-item ${justAddedId === todo.id ? 'new-item' : ''}`}
                    >
                      <input type="checkbox" checked={todo.completed} onChange={() => handleUpdate(todo)} />

                      {editingId === todo.id ? (
                        <div className="edit-container">
                          <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="edit-input" />
                          <div className="edit-actions">
                            <FaCheck className="icon save-icon" onClick={() => handleEditSave(todo.id)} />
                            <FaTimes className="icon cancel-icon" onClick={handleEditCancel} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className={todo.completed ? 'completed' : ''}>{todo.title}</span>
                          <div className="actions">
                            <FaPencilAlt className="icon edit-icon" onClick={() => handleEditStart(todo)} />
                            <FaTrash className="icon delete-icon" onClick={() => handleDelete(todo.id)} />
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;