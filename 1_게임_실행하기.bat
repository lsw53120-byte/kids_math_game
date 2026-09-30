@echo off
cd /d "%~dp0"
if not exist "독립실행_kids_math_game.html" (
    echo Game file is missing.
    pause
    exit /b 1
)
start "" "독립실행_kids_math_game.html"
