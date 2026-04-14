#!/bin/bash

# setup.sh - Comprehensive Deployment Script

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Deployment Setup...${NC}"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Check and Install Dependencies
echo -e "${GREEN}Checking dependencies...${NC}"

# Node.js
if ! command_exists node; then
    echo -e "${RED}Node.js not found. Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# pnpm
if ! command_exists pnpm; then
    echo -e "${RED}pnpm not found. Installing pnpm...${NC}"
    sudo corepack enable
    sudo corepack prepare pnpm@latest --activate
fi

# Docker
if ! command_exists docker; then
    echo -e "${RED}Docker not found. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
fi

# Docker Compose
if ! docker compose version >/dev/null 2>&1; then
    echo -e "${RED}Docker Compose not found. Installing Docker Compose...${NC}"
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
fi

# Nginx
if ! command_exists nginx; then
    echo -e "${RED}Nginx not found. Installing Nginx...${NC}"
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# 2. Configure Nginx
echo -e "${GREEN}Configuring Nginx...${NC}"
if [ -f "nginx.conf" ]; then
    sudo cp nginx.conf /etc/nginx/nginx.conf
    sudo nginx -t && sudo systemctl restart nginx
    echo -e "${GREEN}Nginx configured and restarted.${NC}"
else
    echo -e "${RED}nginx.conf not found in current directory!${NC}"
fi

# 3. Handle .env file
if [ ! -f ".env" ]; then
    echo -e "${RED}.env file not found! Please create it before running this script.${NC}"
    exit 1
fi

# 4. Build and Start Application
echo -e "${GREEN}Building and starting Docker containers...${NC}"
docker compose up --build -d

echo -e "${GREEN}==============================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}Backend: backend.X.X.X.X${NC}"
echo -e "${GREEN}Database Tool: db.X.X.X.X${NC}"
echo -e "${GREEN}==============================${NC}"
echo -e "Note: If this is a fresh Docker install, you might need to log out and back in for group changes to take effect."
