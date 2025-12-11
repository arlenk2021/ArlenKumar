#!/bin/bash

# Script to push to GitHub
# Usage: ./push-to-github.sh [repository-name]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

REPO_NAME="${1:-arlenkumar-website}"

echo -e "${BLUE}=== Push to GitHub ===${NC}\n"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${RED}Error: Git repository not initialized${NC}"
    exit 1
fi

# Check if GitHub CLI is installed
if command -v gh &> /dev/null; then
    echo -e "${GREEN}GitHub CLI detected!${NC}\n"
    
    # Check if user is logged in
    if gh auth status &> /dev/null; then
        echo -e "${GREEN}Creating GitHub repository: $REPO_NAME${NC}"
        
        # Create repo and add remote
        gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
        
        echo -e "\n${GREEN}✓ Successfully pushed to GitHub!${NC}"
        echo -e "${BLUE}Repository URL: https://github.com/$(gh api user --jq .login)/$REPO_NAME${NC}"
    else
        echo -e "${YELLOW}GitHub CLI not authenticated. Please run: gh auth login${NC}"
        echo -e "\n${BLUE}Manual setup instructions:${NC}"
        echo "1. Create a repository on GitHub: https://github.com/new"
        echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
        echo "3. Run: git branch -M main"
        echo "4. Run: git push -u origin main"
    fi
else
    echo -e "${YELLOW}GitHub CLI not installed. Using manual method.${NC}\n"
    echo -e "${BLUE}To push to GitHub:${NC}\n"
    echo "1. Create a new repository on GitHub: https://github.com/new"
    echo "   Repository name: $REPO_NAME"
    echo "   (Make it public or private as you prefer)"
    echo ""
    echo "2. After creating the repository, run these commands:"
    echo ""
    echo "   git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo -e "${YELLOW}Or, if you want to use SSH:${NC}"
    echo "   git remote add origin git@github.com:YOUR_USERNAME/$REPO_NAME.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
fi
