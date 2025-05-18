#!/bin/bash

# Function to handle exit
function cleanup {
  echo "Shutting down servers..."
  kill $(jobs -p)
  exit 0
}

# Trap SIGINT (Ctrl+C)
trap cleanup SIGINT

echo "Starting Disha AI Task Board..."

# Start backend server
echo "Starting backend server..."
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
cd ..

# Wait a bit for backend to initialize
sleep 2

# Check if in WSL environment
if grep -q Microsoft /proc/version; then
  echo "Detected WSL environment"
  # In WSL, the frontend should serve on 0.0.0.0 to be accessible from Windows
  echo "Starting frontend server for WSL..."
  cd frontend
  npm run dev -- --host 0.0.0.0 &
  cd ..
  
  # Display access URLs
  WINDOWS_IP=$(hostname -I | awk '{print $1}')
  echo "Frontend is available at:"
  echo "  WSL: http://localhost:5173"
  echo "  Windows: http://$WINDOWS_IP:5173"
else
  # Normal Linux environment
  echo "Starting frontend server..."
  cd frontend
  npm run dev &
  cd ..
  
  echo "Frontend is available at: http://localhost:5173"
fi

echo "Backend is available at: http://localhost:8000"
echo "Press Ctrl+C to stop both servers."

# Wait for all background processes to finish
wait 