@echo off
title WarrantyClarity AI - Push to GitHub
cd /d "%~dp0"
echo ========================================================
echo   WarrantyClarity AI - GitHub Deployment Helper
echo   Target: https://github.com/AP24110011492/WarrantyClarity.AI.git
echo ========================================================
echo.
python push_to_github.py %*
pause
