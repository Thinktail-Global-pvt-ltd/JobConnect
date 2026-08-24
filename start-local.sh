#!/bin/bash

echo "🚀 Starting JobConnect Local Development Environment..."

PROJECT_DIR="/Users/maayankmalhotra/Desktop/jobconnect"
cd "$PROJECT_DIR"

# 1. Clear artisan cache
php artisan optimize:clear

# 2. Start Laravel Artisan Server in background on Port 8000
php artisan serve --port=8000 &
BACKEND_PID=$!
echo "✅ Laravel Backend running at http://localhost:8000 (PID: $BACKEND_PID)"

# 3. Start Vite Frontend Dev Server in background
cd "$PROJECT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!
echo "✅ Vite Frontend Dev Server starting..."

echo ""
echo "🎉 Local Environment is Live!"
echo "--------------------------------------------------"
echo "🌐 Frontend URL : http://localhost:5173"
echo "🔌 Backend API  : http://localhost:8000/backend/api"
echo "--------------------------------------------------"
echo "Press Ctrl+C to stop all servers."

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
