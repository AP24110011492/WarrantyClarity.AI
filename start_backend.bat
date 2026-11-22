@echo off
title WarrantyClarity AI - Backend Server
echo Starting WarrantyClarity AI FastAPI Backend...
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
