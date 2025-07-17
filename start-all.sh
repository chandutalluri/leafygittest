#!/bin/bash

# 🧠 Unified startup for all essential services
echo "🚀 Starting LeafyHealth Essential Services..."

# Start Image Management Service on port 3035
echo "📸 Starting Image Management Service on port 3035..."
cd backend/domains/image-management && PORT=3035 node src/express-main.js &
IMAGE_PID=$!

# Return to root directory
cd ../../..

# Start Unified Gateway on port 5000
echo "🌐 Starting Unified Gateway on port 5000..."
cd server && node unified-gateway-fixed.js &
GATEWAY_PID=$!

# Return to root directory
cd ..

echo "✅ All services started successfully"
echo "📸 Image Management Service PID: $IMAGE_PID"
echo "🌐 Gateway Service PID: $GATEWAY_PID"
echo "🔗 Gateway Health: http://localhost:5000/api/image-management/health"

# Wait for all background processes
wait