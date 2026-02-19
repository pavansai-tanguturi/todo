https://github.com/user-attachments/assets/c1d281ff-743b-4724-8dc3-076fa8478680

# Todo List Application

A full-stack todo list application with a React frontend and a Node.js backend, deployable as a **single Vercel project**.

## Project Structure
```
todo/
├── api/
│   └── index.js      ← Express API (serverless on Vercel)
├── todo-crud/        ← React frontend
├── vercel.json       ← Vercel deployment config
└── package.json      ← Root dependencies + scripts
```

## Features
- Create, read, update, and delete todos
- Toggle todo completion status
- Edit todo titles
- Modern UI with animations (Framer Motion)
- Theme toggle (default/sunset)
- Filter by All/Active/Completed
- Single Vercel deployment (frontend + API)

## Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

## Local Development

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/todo.git
cd todo
```

### 2. Install Dependencies
```bash
# Root dependencies (for API)
npm install

# Frontend dependencies
cd todo-crud && npm install && cd ..
```

### 3. Run Locally
```bash
# Terminal 1 - Start API (runs on http://localhost:3001)
npm run start:api

# Terminal 2 - Start Frontend (runs on http://localhost:3000)
npm run start:frontend
```

### 4. Usage
- Open `http://localhost:3000`
- Add todos using the input field
- Click checkbox to toggle completion
- Use pencil icon to edit, check to save, X to cancel
- Use trash icon to delete

## Deploy to Vercel (Single Project)

1. Push to GitHub
2. Go to [Vercel](https://vercel.com) → Import your repo
3. Root directory: `/` (default)
4. Deploy!

Vercel will:
- Build the React app from `todo-crud/`
- Deploy the API as a serverless function at `/api/todos`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos/:id` | Get single todo |
| POST | `/api/todos` | Create todo |
| PUT | `/api/todos/:id` | Update todo |
| PATCH | `/api/todos/:id` | Partial update |
| DELETE | `/api/todos/:id` | Delete todo |

## Data Storage

> **Note**: Data is stored in-memory in the Node.js server. On Vercel, serverless functions are stateless — data resets on cold starts. For persistence, integrate a database (Supabase, MongoDB Atlas, PlanetScale, etc.).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:api` | Start API server locally |
| `npm run start:frontend` | Start React dev server |

## Dependencies

### API (root)
- `express`: Web framework
- `cors`: Enable CORS

### Frontend (`todo-crud/`)
- `react`: UI library
- `axios`: HTTP client
- `framer-motion`: Animations
- `react-icons`: Icons

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License
MIT License
