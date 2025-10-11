@echo off
echo Starting TBAE Frontend Server...
echo.
cd frontend
echo Installing/checking dependencies...
call npm install --silent
echo.
echo Starting Next.js development server...
echo Frontend will be available at http://localhost:3000 (or next available port)
echo.
call npm run dev

