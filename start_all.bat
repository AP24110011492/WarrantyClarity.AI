@echo off
title WarrantyClarity AI - Full Stack Launcher
echo ========================================================
echo   WarrantyClarity AI - Product Photo Enhancer Launcher
echo ========================================================
echo.
echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "WarrantyClarity Backend" cmd /c "start_backend.bat"

timeout /t 3 /nobreak >nul

echo [2/2] Launching React Vite Frontend on http://localhost:5173 ...
start "WarrantyClarity Frontend" cmd /c "start_frontend.bat"

timeout /t 4 /nobreak >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo Both servers are running. Press any key to exit this launcher window.
pause
