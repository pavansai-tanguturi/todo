![todo-app-demo.png]()


Below is the updated documentation with an explanation of how data is stored in the Node.js server without a database, highlighted as requested. I'll also include the updated README and GitHub publishing steps again for completeness.

---

### Documentation

#### Project Overview
This project consists of:
1. **Frontend**: A React application for managing a todo list with CRUD operations.
2. **Backend**: A Node.js Express API with in-memory storage (no database).

#### Frontend (React App)
- **Location**: `todo-crud/`
- **Purpose**: Provides a user interface to manage todos.
- **Features**:
  - Add new todos
  - Toggle completion status
  - Edit todo titles
  - Delete todos
  - UI with Open Sans font, gradient background, and icons
- **Dependencies**:
  - `axios`: For API requests
  - `react-icons`: For icons (trash, pencil, check, times)
- **API Endpoint**: `http://localhost:3001/todos`

#### Backend (Node.js API)
- **Location**: `todo-api/`
- **Purpose**: Provides a RESTful API with in-memory storage.
- **Endpoints**:
  - `GET /todos`: Fetch all todos (supports `_limit` query)
  - `POST /todos`: Create a new todo
  - `PUT /todos/:id`: Update a todo
  - `DELETE /todos/:id`: Delete a todo
- **Dependencies**:
  - `express`: Web framework
  - `cors`: Enable CORS
- **Storage**: 
  > **How Data is Stored in Node.js Without a Database**:  
  > The data is stored in an in-memory JavaScript array (`todos`) within the Node.js server's runtime environment. This array is defined in the `index.js` file and initialized with sample todos. When CRUD operations occur:
  > - **Create**: New todos are pushed to the array.
  > - **Read**: The array is returned (or a subset with limit).
  > - **Update**: The array element at the matching index is modified.
  > - **Delete**: The array is filtered to remove the todo.
  > This storage is temporary and resides in the server's RAM. When the server stops or restarts, the array is reinitialized to its original state, losing all changes made during runtime.

---

### README.md

```markdown
# Todo List Application

A full-stack todo list application with a React frontend and a Node.js backend using in-memory storage.

## Project Structure
- `todo-crud/` - React frontend
- `todo-api/` - Node.js Express backend

## Features
- Create, read, update, and delete todos
- Toggle todo completion status
- Edit todo titles
- Modern UI with Open Sans font and gradient background
- Icon-based controls (trash for delete, pencil for edit)

## Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Git](https://git-scm.com/)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app
```

### 2. Backend Setup (`todo-api/`)
1. Navigate to the backend directory:
   ```bash
   cd todo-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node index.js
   ```
   - The API will run on `http://localhost:3001`

### 3. Frontend Setup (`todo-crud/`)
1. Navigate to the frontend directory:
   ```bash
   cd ../todo-crud
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```
   - The app will run on `http://localhost:3000` and connect to the backend at `http://localhost:3001/todos`

### 4. Usage
- Open your browser to `http://localhost:3000`
- Add todos using the input field and "+" button
- Click the checkbox to toggle completion
- Use the pencil icon to edit, then check to save or cross to cancel
- Use the trash icon to delete todos

## Project Commands

### Backend (`todo-api/`)
- Install dependencies: `npm install`
- Start server: `node index.js`

### Frontend (`todo-crud/`)
- Install dependencies: `npm install`
- Start development server: `npm start`
- Build for production: `npm run build`

## Dependencies

### Backend
- `express`: "^4.18.2"
- `cors`: "^2.8.5"

### Frontend
- `react`: "^18.2.0"
- `axios`: "^1.6.0"
- `react-icons`: "^4.11.0"

## Notes
- **Data Storage**: Data is stored in memory in the Node.js server using a JavaScript array. Changes persist only while the server is running and reset on restart.
- The frontend assumes the backend is running at `http://localhost:3001`.

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License
MIT License - see [LICENSE](LICENSE) for details
```

---

### Steps to Publish to GitHub

#### 1. Verify Your Project Structure
Ensure you have:
- `todo-crud/` (React frontend with App.js, App.css, etc.)
- `todo-api/` (Node.js backend with index.js)

Your `todo-api/index.js` should be:

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 3001;

app.use(cors());
app.use(express.json());

let todos = [
  { id: 1, title: 'Learn Node.js', completed: false, userId: 1 },
  { id: 2, title: 'Build API', completed: false, userId: 1 }
];
let nextId = 3;

app.get('/todos', (req, res) => {
  const limit = parseInt(req.query._limit) || todos.length;
  res.json(todos.slice(0, limit));
});

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

app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: 'Todo not found' });
  todos[index] = { ...todos[index], ...req.body, id };
  res.json(todos[index]);
});

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

And `todo-crud/App.js` should have `const API_URL = 'http://localhost:3001/todos';`.

#### 2. Create a Root Directory
```bash
mkdir todo-app
mv todo-crud todo-api todo-app/
cd todo-app
```

#### 3. Initialize Git
```bash
git init
```

#### 4. Add README and .gitignore
- Create `README.md`:
  ```bash
  echo "# Todo List Application" > README.md  # Then paste the rest manually or with a text editor
  ```
- Create `.gitignore`:
  ```bash
  echo "node_modules/" > .gitignore
  echo "*.log" >> .gitignore
  echo ".DS_Store" >> .gitignore
  ```

#### 5. Add and Commit Files
```bash
git add .
git commit -m "Initial commit with in-memory todo app"
```

#### 6. Create a GitHub Repository
1. Go to [GitHub](https://github.com), log in, click "New".
2. Name it `todo-app`, choose public/private, don’t initialize with a README.
3. Copy the repository URL (e.g., `https://github.com/your-username/todo-app.git`).

#### 7. Push to GitHub
```bash
git remote add origin https://github.com/your-username/todo-app.git
git push -u origin main
```

#### Full Command Sequence
```bash
# Create root directory
mkdir todo-app
cd todo-app

# Setup frontend
npx create-react-app todo-crud
cd todo-crud
npm install axios react-icons
# Copy App.js and App.css from earlier

# Setup backend
cd ../
mkdir todo-api
cd todo-api
npm init -y
npm install express cors
# Copy index.js from above

# Initialize Git
cd ../
git init
echo "# Todo List Application" > README.md  # Add README content
echo "node_modules/" > .gitignore
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/your-username/todo-app.git
git push -u origin main
```

---

### Running the App After Cloning
1. **Backend**:
   ```bash
   cd todo-api
   npm install
   node index.js
   ```
2. **Frontend**:
   ```bash
   cd ../todo-crud
   npm install
   npm start
   ```

---

### Notes
- The documentation now highlights how data is stored in Node.js without a database, as requested.
- Replace `your-username` with your GitHub username.
- This setup is in-memory only; if you want persistence later, we can add MongoDB.
