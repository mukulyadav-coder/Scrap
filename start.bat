@echo off
echo ========================================================
echo Starting Kabadiwala Connect (FastAPI + React Vite)
echo ========================================================

start "Kabadiwala API Server" cmd /k "cd server && python -m uvicorn main:app --port 8000 --reload"
start "Kabadiwala Web Client" cmd /k "cd client && npm run dev"

echo.
echo Both servers are launching:
echo - Frontend: http://localhost:5173
echo - Backend API & Docs: http://127.0.0.1:8000/docs
echo ========================================================

