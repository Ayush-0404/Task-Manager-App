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
- 📱 Minimilistic & responsive design for all devices following design process

## Screenshots

<table>
  <tr>
    <td><strong>Light Mode</strong></td>
    <td><strong>Dark Mode</strong></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/0b533235-0176-47ed-a619-d7fc91e06ec9" alt="Light Mode" width="350"/></td>
    <td><img src="https://github.com/user-attachments/assets/220d78bb-ffc8-4114-9cf0-2ecfa391ee83" alt="Dark Mode" width="350"/></td>
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
https://github.com/[your username]/Task-Manager-App.git
```

### Running the Application

#### Here are the commands to run the project on Windows:
Open two terminals.

1. Terminal 1 
Backend Setup

```
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

```
OR 
```
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run the backend server 
python main.py  
```
2. Terminal 2 -
Frontend Setup (in other terminal)

```
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at  - `http://localhost:5173`

#### Here are the commands to run the project on Linux:

1. Install Uvicorn and dependencies in Linux

Open a terminal and run:

```
cd backend
python -m pip install --upgrade pip [Optional]
python -m pip install -r requirements.txt

```
Then start the script
```
cd ..
bash start.sh
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

### Moving Tasks - Simple

1. Drag a task card
2. Drop it into the desired column


### Editing & Deletition of tasks -

1. Click on the three dot at top right of task.
2. select delete to remove it & edit for changes

### Filtering and Sorting (for better management of tasks) -

1. Click the "Filter" button in the header
2. Select your preferred sorting method (by date, priority, etc.) or filter option

### Changing Theme 

1. Click the settings icon in the top-right corner
2. Toggle the "Dark Mode" switch
3. There is also an option of a light version with no animation (could be enabled by toggling Animation switch)

##  Contributing -

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

-  feel free to contact for any discussion .

## Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

Made with ❤️ by Ayush
