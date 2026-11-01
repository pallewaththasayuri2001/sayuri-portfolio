@echo off
title Sayuri Pallewaththa Portfolio
echo =========================================================
echo   Opening Sayuri Pallewaththa Portfolio Website...
echo =========================================================
echo.
start "" "%~dp0index.html"
echo Opening in your default browser...
echo.
echo Starting local web server on http://localhost:8000
echo (You can close this window at any time to stop the server)
echo.
python -m http.server 8000 --directory "%~dp0"
pause
