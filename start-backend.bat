@echo off
echo Starting TBAE Backend Server...
echo.
cd backend
call ..\venv\Scripts\activate.bat
echo Checking for issues...
python manage.py check
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Backend check failed!
    pause
    exit /b 1
)
echo.
echo Backend check passed!
echo Starting Django development server on http://localhost:8000
echo.
python manage.py runserver

