#!/bin/bash

# Vercel Deployment Logs Script
# This script helps you view and manage Vercel deployment logs

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Vercel Deployment Logs ===${NC}\n"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Error: Vercel CLI is not installed.${NC}"
    echo -e "${YELLOW}Install it with: npm i -g vercel${NC}\n"
    exit 1
fi

# Function to show help
show_help() {
    echo "Usage: ./vercel-deploy-logs.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --tail, -t          Follow logs in real-time (like tail -f)"
    echo "  --deployment, -d    Show logs for specific deployment ID"
    echo "  --list, -l          List recent deployments"
    echo "  --help, -h           Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./vercel-deploy-logs.sh --tail"
    echo "  ./vercel-deploy-logs.sh --list"
    echo "  ./vercel-deploy-logs.sh --deployment dpl_xxxxx"
}

# Parse arguments
TAIL=false
DEPLOYMENT_ID=""
LIST=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --tail|-t)
            TAIL=true
            shift
            ;;
        --deployment|-d)
            DEPLOYMENT_ID="$2"
            shift 2
            ;;
        --list|-l)
            LIST=true
            shift
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# List deployments
if [ "$LIST" = true ]; then
    echo -e "${GREEN}Fetching recent deployments...${NC}\n"
    vercel ls
    exit 0
fi

# Show logs for specific deployment
if [ -n "$DEPLOYMENT_ID" ]; then
    echo -e "${GREEN}Fetching logs for deployment: $DEPLOYMENT_ID${NC}\n"
    if [ "$TAIL" = true ]; then
        vercel logs "$DEPLOYMENT_ID" --follow
    else
        vercel logs "$DEPLOYMENT_ID"
    fi
    exit 0
fi

# Default: show recent logs
if [ "$TAIL" = true ]; then
    echo -e "${GREEN}Following logs in real-time... (Press Ctrl+C to stop)${NC}\n"
    vercel logs --follow
else
    echo -e "${GREEN}Fetching recent deployment logs...${NC}\n"
    vercel logs
fi
