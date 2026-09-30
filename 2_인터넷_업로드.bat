@echo off
cd /d "%~dp0"
git rev-parse --is-inside-work-tree >nul 2>&1 || goto :error
for /f "delims=" %%B in ('git branch --show-current') do set "branch=%%B"
if /i not "%branch%"=="main" (
    echo Current branch is not main. Upload stopped.
    pause
    exit /b 1
)
git add index.html style.css audio.js game.js sw.js manifest.json icon-192.png icon-512.png
if errorlevel 1 goto :error
git diff --cached --quiet -- index.html style.css audio.js game.js sw.js manifest.json icon-192.png icon-512.png
if not errorlevel 1 (
    echo No game changes to upload.
    pause
    exit /b 0
)
git commit -m "Improve kids math game" -- index.html style.css audio.js game.js sw.js manifest.json icon-192.png icon-512.png
if errorlevel 1 goto :error
git push origin main
if errorlevel 1 goto :error
echo Upload complete.
pause
exit /b 0
:error
echo Upload failed. Check Git status and network connection.
pause
exit /b 1
