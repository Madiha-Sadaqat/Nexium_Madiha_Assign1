# Vercel Environment Variables Setup

## 🔧 How to Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard
1. Open your browser and go to [vercel.com](https://vercel.com)
2. Sign in to your account
3. Navigate to your "ResumeTailor" project

### Step 2: Access Environment Variables
1. Click on your project
2. Go to **Settings** tab
3. Click on **Environment Variables** in the left sidebar

### Step 3: Add These Environment Variables

Add each variable one by one:

#### Variable 1:
- **Name:** `SUPABASE_URL`
- **Value:** `https://koenwbwuzqdgvxanezzd.supabase.co`
- **Environment:** Production, Preview, Development (select all)

#### Variable 2:
- **Name:** `SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZW53Ynd1enFkZ3Z4YW5lenpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0ODExMTksImV4cCI6MjA2NzA1NzExOX0.7ZCQmvATw7R1aUeqdwiBIKWO0ZOGoqzw30oZcm2ykvM`
- **Environment:** Production, Preview, Development (select all)

#### Variable 3:
- **Name:** `MONGODB_URI`
- **Value:** `mongodb+srv://madihasadaqat003:bsef22m518@nexium-mongo.okgdg75.mongodb.net/resume-tailor?retryWrites=true&w=majority&appName=nexium-mongo`
- **Environment:** Production, Preview, Development (select all)

### Step 4: Redeploy
1. After adding all variables, go to **Deployments** tab
2. Click **Redeploy** on your latest deployment
3. Wait for the deployment to complete

## 🎯 Expected Result
After adding these environment variables and redeploying, your login functionality should work perfectly!

## 🔍 Alternative: Quick Test
If you want to test locally first, make sure your `.env.local` file exists in the `internship/grand-project/app` directory with the same values. 