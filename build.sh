#!/usr/bin/env bash
# exit on error
set -o errexit

echo "==============================================="
echo "  WarrantyClarity AI - Render Build Pipeline"
echo "==============================================="

echo "===> [1/3] Building React 19 Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "===> [2/3] Installing Python Backend Dependencies..."
cd backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

echo "===> [3/3] Generating Sample Warranty Defect Cases..."
python generate_samples.py
cd ..

echo "===> Build completed successfully!"
