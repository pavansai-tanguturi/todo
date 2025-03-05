import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
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

  return (
    <div className="App">
      <div className="container">
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
              <button type="submit" className="add-button">ADD</button> {/* Standard button */}
            </form>

            <div className="todo-list">
              {todos.map(todo => (
                <div key={todo.id} className="todo-item">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleUpdate(todo)}
                  />
                  
                  {editingId === todo.id ? (
                    <div className="edit-container">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="edit-input"
                      />
                      <div className="edit-actions">
                        <FaCheck 
                          className="icon save-icon" 
                          onClick={() => handleEditSave(todo.id)}
                        />
                        <FaTimes 
                          className="icon cancel-icon" 
                          onClick={handleEditCancel}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className={todo.completed ? 'completed' : ''}>
                        {todo.title}
                      </span>
                      <div className="actions">
                        <FaPencilAlt 
                          className="icon edit-icon" 
                          onClick={() => handleEditStart(todo)}
                        />
                        <FaTrash 
                          className="icon delete-icon" 
                          onClick={() => handleDelete(todo.id)}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;