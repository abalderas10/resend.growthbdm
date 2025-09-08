# Deployment Guide - MIPIM Email System

## Deploy to Vercel

### Prerequisites
1. Vercel account
2. Domain `aliest.growthbdm.com` configured
3. Environment variables set

### Quick Deploy

#### Option 1: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy to production
pnpm run deploy

# Deploy preview
pnpm run deploy:preview
```

#### Option 2: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import this repository
3. Configure environment variables:
   - `RESEND_API_KEY`: re_5qZePDtW_K4oimtTzkwMW6sMPvLoXYyUC
   - `NEXT_PUBLIC_APP_URL`: https://aliest.growthbdm.com
4. Deploy

#### Option 3: GitHub Integration
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Auto-deploy on push to main branch

### Domain Configuration

The project is configured for domain: `aliest.growthbdm.com`

1. In Vercel dashboard, go to Project Settings > Domains
2. Add custom domain: `aliest.growthbdm.com`
3. Configure DNS records as instructed by Vercel

### Environment Variables

Required environment variables in Vercel:
- `RESEND_API_KEY`: API key for Resend email service
- `NEXT_PUBLIC_APP_URL`: Public URL of the application

### Build Configuration

The project uses the following build settings:
- Framework: Next.js
- Build Command: `pnpm build`
- Output Directory: `.next`
- Install Command: `pnpm install`

### Verification

After deployment, verify:
1. Application loads at `https://aliest.growthbdm.com`
2. Email invitations work correctly
3. Ticket generation and QR codes function properly
4. Clean view works with `?clean=true` parameter

### Troubleshooting

- Check Vercel function logs for API errors
- Verify environment variables are set correctly
- Ensure domain DNS is properly configured
- Check Resend API key validity