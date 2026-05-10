@echo off
REM Quick start script for FPS Game
REM Change to the game directory and start a local server

cd /d "%~dp0"
echo Starting FPS Game Server...
echo.
echo The game will open at: http://localhost:8080
echo Press Ctrl+C to stop the server
echo.

python -m http.server 8080
