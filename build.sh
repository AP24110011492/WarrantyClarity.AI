#!/usr/bin/env bash
# exit on error
set -o errexit

echo "==============================================="
echo "  WarrantyClarity AI - Render Build Pipeline"
echo "==============================================="

echo "===> [1/3] Preparing React 19 Frontend..."
cd frontend
if [ -f package-lock.json ]; then
  rm -f package-lock.json
fi

# Attempt fresh build on Linux environment
if npm install --include=optional && npm run build; then
  echo "✓ Fresh frontend build succeeded!"
else
  echo "Notice: Using committed pre-built frontend distribution."
fi
cd ..

echo "===> [2/3] Installing Python Backend Dependencies..."
cd backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

echo "===> [3/3] Generating Sample Warranty Defect Cases..."
python generate_samples.py
cd ..

echo "===> Build completed successfully!"
