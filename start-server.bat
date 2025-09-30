@echo off
cd /d "C:\Users\deepa\tvk"
echo Starting TVK Website Server...
echo.
echo Open your browser and go to: http://localhost:5500
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 5500
pause