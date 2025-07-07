# Deployment Guide - Quote Generator Web App

## Quick Deploy to Vercel

### Step 1: Prepare Your Code
Make sure your code is committed to a GitHub repository.

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Next.js
6. Click "Deploy"

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: quote-generator (or your preferred name)
# - Directory: ./ (current directory)
# - Override settings? No
```

### Step 3: Get Your Live URL
After deployment, Vercel will provide you with:
- **Production URL**: `https://your-project-name.vercel.app`
- **Preview URLs**: For each branch/PR

### Step 4: Update README
Replace the placeholder in README.md:
```markdown
🔗 **Deployed on Vercel**: https://nexium-madiha-assign1.vercel.app
```

## Automatic Deployments
- Every push to `main` branch = automatic production deployment
- Every pull request = automatic preview deployment

## Environment Variables
No environment variables needed for this project.

## Troubleshooting

### Build Errors
If you get build errors:
1. Check that all dependencies are installed: `npm install`
2. Test locally: `npm run build`
3. Check the build logs in Vercel dashboard

### Common Issues
- **Port conflicts**: Vercel handles this automatically
- **Missing dependencies**: Make sure `package.json` includes all required packages
- **TypeScript errors**: Fix any TS errors before deploying

## Performance
- Vercel automatically optimizes Next.js apps
- Static assets are served from CDN
- Automatic HTTPS enabled

## Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Add your custom domain
3. Update DNS records as instructed 