# Vercel Deployment Guide

This project is configured for deployment on Vercel. This guide explains how to deploy and view deployment logs.

## Prerequisites

1. Install Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

## Deployment

### First Time Deployment

1. Link your project to Vercel:
   ```bash
   vercel
   ```

2. Follow the prompts to:
   - Link to existing project or create new one
   - Set up project settings
   - Deploy

### Production Deployment

Deploy to production:
```bash
vercel --prod
```

Or use the npm script:
```bash
npm run deploy
```

## Viewing Deployment Logs

### Using the Script

The `vercel-deploy-logs.sh` script provides an easy way to view logs:

```bash
# View recent logs
./vercel-deploy-logs.sh

# Follow logs in real-time
./vercel-deploy-logs.sh --tail

# List recent deployments
./vercel-deploy-logs.sh --list

# View logs for specific deployment
./vercel-deploy-logs.sh --deployment dpl_xxxxx
```

### Using Vercel CLI Directly

```bash
# View recent logs
vercel logs

# Follow logs in real-time
vercel logs --follow

# View logs for specific deployment
vercel logs <deployment-id>

# List all deployments
vercel ls
```

### Using npm scripts

```bash
# View logs
npm run logs

# Follow logs in real-time
npm run logs:tail
```

## Configuration Files

- **vercel.json**: Main Vercel configuration
  - Static file serving
  - Headers for security and caching
  - URL rewrites (e.g., `/contact` → `/contact.html`)

- **.vercelignore**: Files to exclude from deployment

- **package.json**: Contains deployment scripts

## Project Structure

This is a static site, so no build step is required. Vercel will serve:
- `index.html` as the homepage
- `contact.html` accessible at `/contact`
- All static assets (CSS, JS, images)

## Caching Strategy

The configuration includes optimized caching:
- CSS and JS files: 1 year cache
- Images: 1 year cache
- HTML files: Standard cache headers

## Security Headers

The following security headers are configured:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## Troubleshooting

### View Build Logs

If a deployment fails, check the logs:
```bash
vercel logs --follow
```

### Check Deployment Status

```bash
vercel ls
```

### Inspect a Specific Deployment

```bash
vercel inspect <deployment-url>
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
