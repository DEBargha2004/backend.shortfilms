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

# curl & ca-certificates
if ! command_exists curl; then
    echo -e "${RED}curl not found. Installing curl and basic utilities...${NC}"
    sudo apt-get update && sudo apt-get install -y curl ca-certificates gnupg
fi

# Node.js
if ! command_exists node; then
    echo -e "${RED}Node.js not found. Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# pnpm
if ! command_exists pnpm; then
    echo -e "${RED}pnpm not found. Installing pnpm...${NC}"
    if command_exists npm; then
        sudo npm install -g pnpm || (sudo corepack enable && sudo corepack prepare pnpm@latest --activate)
    else
        sudo corepack enable && sudo corepack prepare pnpm@latest --activate
    fi
fi

# Docker
if ! command_exists docker; then
    echo -e "${RED}Docker not found. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
fi

# Ensure Docker service is running
echo -e "${GREEN}Ensuring Docker service is active...${NC}"
if command_exists systemctl; then
    sudo systemctl enable docker
    sudo systemctl start docker
elif command_exists service; then
    sudo service docker start
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
    if sudo nginx -t; then
        echo -e "${GREEN}Nginx configuration is valid. Restarting Nginx...${NC}"
        if command_exists systemctl; then
            sudo systemctl restart nginx || sudo service nginx restart || sudo nginx -s reload
        elif command_exists service; then
            sudo service nginx restart || sudo nginx -s reload
        else
            sudo nginx -s reload
        fi
        echo -e "${GREEN}Nginx configured and restarted successfully.${NC}"
    else
        echo -e "${RED}Nginx configuration test failed! Please check nginx.conf.${NC}"
    fi
else
    echo -e "${RED}nginx.conf not found in current directory!${NC}"
fi

# 3. Handle .env file
if [ ! -f ".env" ]; then
    echo -e "${RED}.env file not found! Please create it before running this script.${NC}"
    exit 1
fi

# Detect if Docker commands require sudo
DOCKER_CMD="docker"
if ! docker ps >/dev/null 2>&1; then
    if sudo docker ps >/dev/null 2>&1; then
        DOCKER_CMD="sudo docker"
    else
        echo -e "${RED}Cannot run docker commands. Please check if Docker daemon is running and accessible.${NC}"
        exit 1
    fi
fi

# 4. Build and Start Application
echo -e "${GREEN}Building and starting Docker containers...${NC}"
$DOCKER_CMD compose up --build -d

echo -e "${GREEN}==============================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}Backend is running!${NC}"
echo -e "${GREEN}==============================${NC}"
echo -e "Note: If this is a fresh Docker install, you might need to log out and back in for group changes to take effect without sudo."
