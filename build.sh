#!/usr/bin/env bash
# Build script for Render/Railway deployment

set -e

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r backend/requirements.txt

echo "Installing Node dependencies..."
cd frontend
npm install --legacy-peer-deps

echo "Building React frontend..."
npm run build

echo "Build complete!"
