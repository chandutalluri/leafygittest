#!/bin/bash

# Image Management Service Startup Script
echo "🚀 Starting Image Management Service..."

# Set port
export PORT=3035

# Create uploads directory if it doesn't exist
mkdir -p ../../../uploads/images

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Build the service
echo "🔨 Building service..."
npm run build

# Start the service
echo "▶️  Starting service on port $PORT..."
npm run start:prod