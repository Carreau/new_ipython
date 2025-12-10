# GitHub Pages Deployment

This repository is configured to automatically deploy to GitHub Pages using GitHub Actions.

## Setup Instructions

1. **Enable GitHub Pages:**
   - Go to your repository Settings → Pages
   - Under "Source", select **"GitHub Actions"** (not "Deploy from a branch")

2. **Configure Base Path:**
   - The workflow automatically detects the base path from your repository name
   - If your repo is `username.github.io` (root domain), set `BASE_PATH` to empty string in:
     - Repository Settings → Secrets and variables → Actions → New repository secret
     - Name: `BASE_PATH`, Value: (leave empty or set to `/`)
   - If your repo is `username/repo-name`, the base path will be `/repo-name` automatically
   - You can override by setting `BASE_PATH` secret manually

3. **Push to main branch:**
   - The workflow will automatically trigger on push to `main`
   - You can also manually trigger it from Actions → Deploy to GitHub Pages → Run workflow

## How It Works

- On every push to `main`, the workflow:
  1. Builds the Astro site
  2. Deploys it to the `gh-pages` branch
  3. Makes it available at your GitHub Pages URL

## Environment Variables

If you need environment variables (like `GITHUB_TOKEN` for API calls), add them in:
- Repository Settings → Secrets and variables → Actions

Then uncomment the env section in `.github/workflows/deploy.yml`.
