@echo off
echo ========================================
echo  TBAE Application Launcher
echo ========================================
echo.
echo This will start both Backend and Frontend servers
echo in separate windows.
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo Admin Panel: http://localhost:3000/admin
echo.
pause

echo Starting Backend Server...
start "TBAE Backend" cmd /k "cd /d %~dp0 && start-backend.bat"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "TBAE Frontend" cmd /k "cd /d %~dp0 && start-frontend.bat"

echo.
echo Both servers are starting in separate windows!
echo.
echo Press any key to close this window...
pause >nul

