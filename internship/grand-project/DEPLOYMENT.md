# 🚀 Deployment Guide - AI-Powered Resume Tailor

## 📋 Prerequisites

Before deploying, ensure you have:
- [Vercel Account](https://vercel.com)
- [Supabase Account](https://supabase.com)
- [MongoDB Atlas Account](https://mongodb.com/atlas)
- [OpenAI API Key](https://platform.openai.com)

## 🎯 Quick Deployment

### 1. **Deploy to Vercel**

```bash
# Navigate to the app directory
cd internship/grand-project/app

# Install dependencies
npm install

# Build the application
npm run build

# Deploy to Vercel
npx vercel --prod
```

### 2. **Configure Environment Variables**

In your Vercel dashboard, add these environment variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# MongoDB Configuration
MONGODB_URI=your_mongodb_atlas_connection_string

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Application URLs
NEXT_PUBLIC_API_URL=https://your-vercel-app.vercel.app
```

### 3. **Database Setup**

#### Supabase Setup
1. Create a new Supabase project
2. Create the following tables:

```sql
-- resumes table
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  resume_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- history table
CREATE TABLE history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### MongoDB Setup
1. Create a MongoDB Atlas cluster
2. Create a database named `resume-tailor`
3. Create a collection named `resumes`

### 4. **Authentication Setup**

#### Supabase Auth Configuration
1. Enable Email Auth in Supabase Dashboard
2. Configure redirect URLs:
   - `https://your-vercel-app.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

#### Row Level Security (RLS)
Enable RLS on the resumes table:

```sql
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resumes" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON resumes
  FOR DELETE USING (auth.uid() = user_id);
```

## 🔧 Manual Deployment Steps

### Step 1: Prepare the Application

```bash
# Clone the repository
git clone <your-repo-url>
cd internship/grand-project/app

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Step 2: Configure Environment Variables

Create `.env.local` file:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-tailor

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Application
NEXT_PUBLIC_API_URL=https://your-vercel-app.vercel.app
```

### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 4: Configure Vercel Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all the environment variables from Step 2

### Step 5: Test the Deployment

1. Visit your deployed URL
2. Test the authentication flow
3. Test resume creation
4. Test AI tailoring feature
5. Test PDF/DOCX generation

## 🐛 Troubleshooting

### Common Issues

#### 1. **Authentication Errors**
- Check Supabase URL and API key
- Verify redirect URLs in Supabase dashboard
- Ensure RLS policies are correctly configured

#### 2. **Database Connection Errors**
- Verify MongoDB connection string
- Check Supabase connection
- Ensure environment variables are set correctly

#### 3. **AI Feature Not Working**
- Verify OpenAI API key
- Check API rate limits
- Ensure proper error handling

#### 4. **Build Errors**
- Check Node.js version (18+ required)
- Verify all dependencies are installed
- Check TypeScript compilation

### Debug Commands

```bash
# Check build locally
npm run build

# Test production build
npm run start

# Check environment variables
echo $SUPABASE_URL
echo $MONGODB_URI
echo $OPENAI_API_KEY
```

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor performance metrics
- Track user interactions

### Error Tracking
- Set up error monitoring
- Monitor API response times
- Track database performance

## 🔒 Security Checklist

- [ ] Environment variables are set
- [ ] RLS policies are enabled
- [ ] API keys are secure
- [ ] HTTPS is enabled
- [ ] CORS is configured
- [ ] Rate limiting is in place

## 🎉 Success Indicators

Your deployment is successful when:

1. ✅ Application loads without errors
2. ✅ Authentication works (magic link)
3. ✅ Resume creation works
4. ✅ AI tailoring works
5. ✅ PDF/DOCX generation works
6. ✅ History tracking works
7. ✅ Dark/light theme toggle works

## 📞 Support

If you encounter issues:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review [Supabase documentation](https://supabase.com/docs)
3. Check [MongoDB Atlas documentation](https://docs.atlas.mongodb.com)
4. Open an issue in the repository

---

**Deployment Status: ✅ Ready for Production** 