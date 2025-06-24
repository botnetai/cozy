#!/bin/bash

# Quick start script for testing Cozy Cloud

echo "🚀 Cozy Cloud Quick Start Testing Script"
echo "========================================"

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install from https://bun.sh"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Check for environment variables
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  ANTHROPIC_API_KEY is not set."
    echo "   Please run: export ANTHROPIC_API_KEY='your-api-key'"
    echo ""
fi

echo "✅ Prerequisites check complete"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Build container if needed
echo ""
echo "🐳 Building container (if needed)..."
cd sandbox-image
if [ ! "$(docker images -q cozy-sandbox:latest 2> /dev/null)" ]; then
    echo "Building container image..."
    ./build.sh
else
    echo "Container image already exists."
fi
cd ..

# Start development servers
echo ""
echo "🌟 Starting development servers..."
echo "   Worker API: http://localhost:8787"
echo "   Web App: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Run development servers
bun dev