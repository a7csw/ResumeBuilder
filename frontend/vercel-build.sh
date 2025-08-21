#!/bin/bash

# Ensure we're in the right directory
echo "Current directory: $(pwd)"

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if vite is available
echo "Checking vite availability..."
npx vite --version

# Build the project
echo "Building project..."
npm run build

echo "Build completed successfully!"
