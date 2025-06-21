#!/bin/bash

# 75 Align Development Server Startup Script
echo "🚀 Starting 75 Align Development Environment..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating environment file..."
    cp env.example .env
    # Update DATABASE_URL for SQLite
    sed -i '' 's|DATABASE_URL=".*"|DATABASE_URL="file:./dev.db"|' .env
fi

# Check if database exists and is up to date
echo "🗄️  Setting up database..."
npm run db:generate
npm run db:push

# Start development server
echo "🌐 Starting Next.js development server..."
echo "Your app will be available at: http://localhost:3000"
npm run dev 