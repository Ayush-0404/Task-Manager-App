# KaamKaaj - Task Manager

![KaamKaaj Logo](https://img.shields.io/badge/KaamKaaj-Task%20Manager-purple)
![Version](https://img.shields.io/badge/version-1.0.0-green)

> A beautiful, interactive Kanban-style task management application with real-time updates, drag and drop functionality, and a visually pleasing UI.

## ✨ Features

-  Kanban board with To Do, In Progress, and Done columns
-  Task prioritization (High, Medium, Low) with visual indicators
-  Drag and drop tasks between columns
-  Search functionality to find tasks across the board
-  Filter tasks by priority, date, and other attributes
-  Light and dark mode for accesibility with beautiful UI
-  Sound effects for better user experience
-  Confetti celebration when tasks are completed
- 📱 Responsive design for all devices

## Screenshots

<table>
  <tr>
    <td><strong>Light Mode</strong></td>
    <td><strong>Dark Mode</strong></td>
  </tr>
  <tr>
    <td><em>[image](https://github.com/user-attachments/assets/0b533235-0176-47ed-a619-d7fc91e06ec9)
</em></td>
    <td><em>[image](https://github.com/user-attachments/assets/220d78bb-ffc8-4114-9cf0-2ecfa391ee83)
</em></td>
  </tr>
</table>

## Tech Stack

- **Frontend**:
  - React
  - TypeScript
  - Framer Motion (for animations)
  - Tailwind CSS (for styling)
  
- **Additional Libraries**:
  - react-confetti (for celebration effects)
  - use-sound (for sound effects)
  - uuid (for unique identifiers)

##  Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/kaamkaaj.git
cd kaamkaaj
```

2. Install dependencies:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies (if applicable)
cd ../backend
npm install
```

### Running the Application

#### Development Mode

```bash
# Start backend server (if applicable)
cd backend
npm run dev

# Start frontend in a new terminal
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

#### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Serve the built frontend (optional)
npm run serve
```

## Project Structure

```
kaamkaaj/
├── backend/              # Backend server code (if applicable)
│   └── app/             
│       └── ...          # Backend application code
├── frontend/            # Frontend React application
│   ├── public/          # Static assets
│   │   └── sounds/      # Sound effect files
│   └── src/             # Source code
│       ├── components/  # React components
│       ├── hooks/       # Custom React hooks
│       ├── App.tsx      # Main application component
│       ├── types.ts     # TypeScript type definitions
│       └── ...          # Other source files
└── README.md            # This file
```

## API Documentation

The application communicates with a backend API for data persistence. Here are the available endpoints:

### Task Endpoints

- **GET /api/board** - Fetches the entire board with all columns and tasks
- **POST /api/tasks** - Creates a new task
- **PATCH /api/tasks/:id** - Updates an existing task
- **DELETE /api/tasks/:id** - Deletes a task

## 📖 How to Use

### Adding Tasks

1. Click the "+" button in any column
2. Fill in the task details (title, description, etc.)
3. Click "Save" to add the task to the column

### Moving Tasks

1. Drag a task card
2. Drop it into the desired column

### Filtering and Sorting

1. Click the "Filter" button in the header
2. Select your preferred sorting method (by date, priority, etc.) or filter option

### Changing Theme

1. Click the settings icon in the top-right corner
2. Toggle the "Dark Mode" switch

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

Made with ❤️ by Ayush
