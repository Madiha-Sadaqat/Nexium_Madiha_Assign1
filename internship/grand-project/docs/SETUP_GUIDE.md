# 🚀 Complete Setup Guide

This guide will walk you through setting up the AI-Powered Resume Tailor project from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Code editor** (VS Code recommended)

### Check Your Environment

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

## 🏗 Project Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd internship/grand-project/app

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the `app` directory:

```bash
# Create environment file
touch .env.local
```

Add the following environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
```

## 🗄 Database Setup

### Supabase Setup

#### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `resume-tailor`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users

#### 2. Get Project Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 3. Create Database Tables

Run the following SQL in the Supabase SQL Editor:

```sql
-- Create resumes table
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mongo_id TEXT
);

-- Create history table
CREATE TABLE history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  resume_id UUID REFERENCES resumes(id),
  action TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for resumes
CREATE POLICY "Users can view own resumes" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON resumes
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for history
CREATE POLICY "Users can view own history" ON history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" ON history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### 4. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Enable **Email confirmations**
3. Configure email templates (optional)
4. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.vercel.app/auth/callback` (production)

### MongoDB Setup

#### 1. Create MongoDB Atlas Account

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Sign up or log in
3. Create a new project

#### 2. Create Cluster

1. Click **Build a Database**
2. Choose **FREE** tier (M0)
3. Select your preferred provider and region
4. Click **Create**

#### 3. Configure Database Access

1. Go to **Database Access**
2. Click **Add New Database User**
3. Create a user with **Read and write to any database** permissions
4. Save the username and password

#### 4. Configure Network Access

1. Go to **Network Access**
2. Click **Add IP Address**
3. For development: Click **Allow Access from Anywhere** (0.0.0.0/0)
4. For production: Add your server's IP address

#### 5. Get Connection String

1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Add this to your `.env.local` as `MONGODB_URI`

Example connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/resume-tailor?retryWrites=true&w=majority
```

## 🤖 OpenAI Setup

### 1. Create OpenAI Account

1. Go to [openai.com](https://openai.com)
2. Sign up or log in
3. Add payment method (required for API access)

### 2. Generate API Key

1. Go to **API Keys**
2. Click **Create new secret key**
3. Give it a name (e.g., "Resume Tailor")
4. Copy the key and add to `.env.local` as `OPENAI_API_KEY`

### 3. Set Usage Limits

1. Go to **Usage** → **Billing**
2. Set spending limits to control costs
3. Monitor usage regularly

## 🚀 Development Setup

### 1. Start Development Server

```bash
# Start the development server
npm run dev
```

### 2. Verify Installation

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the login page
3. Test the authentication flow

### 3. Test Database Connections

Create a test file to verify connections:

```bash
# Create test file
touch test-connections.js
```

Add the following content:

```javascript
// test-connections.js
const { createClient } = require('@supabase/supabase-js');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnections() {
  console.log('Testing database connections...\n');

  // Test Supabase
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const { data, error } = await supabase.from('resumes').select('count');
    if (error) throw error;
    console.log('✅ Supabase connection successful');
  } catch (error) {
    console.log('❌ Supabase connection failed:', error.message);
  }

  // Test MongoDB
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('resume-tailor');
    await db.command({ ping: 1 });
    console.log('✅ MongoDB connection successful');
    await client.close();
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
  }

  // Test OpenAI
  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5
    });
    console.log('✅ OpenAI connection successful');
  } catch (error) {
    console.log('❌ OpenAI connection failed:', error.message);
  }
}

testConnections();
```

Run the test:

```bash
node test-connections.js
```

## 🔧 Configuration Files

### Next.js Configuration

The project uses the default Next.js configuration with some customizations:

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
};

export default nextConfig;
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
```

## 🧪 Testing the Setup

### 1. Test Authentication

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter your email address
3. Check your email for the magic link
4. Click the link to authenticate
5. You should be redirected to the dashboard

### 2. Test Resume Creation

1. Navigate to the resume input form
2. Fill out the form with test data
3. Click "Save Draft" to test database saving
4. Click "AI Tailor Resume" to test AI integration

### 3. Test Database Operations

1. Create a resume and save it
2. Check the Supabase dashboard to see the data
3. Check MongoDB Atlas to see the data
4. Test the history functionality

## 🚨 Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading

```bash
# Check if .env.local exists
ls -la .env.local

# Restart the development server
npm run dev
```

#### 2. Database Connection Errors

**Supabase:**
- Verify your project URL and anon key
- Check if RLS policies are enabled
- Ensure tables are created correctly

**MongoDB:**
- Verify your connection string
- Check network access settings
- Ensure database user has correct permissions

#### 3. OpenAI API Errors

- Verify your API key is correct
- Check your OpenAI account billing
- Ensure you have sufficient credits

#### 4. Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart development server
npm run dev
```

### Debug Mode

Enable debug logging by adding to `.env.local`:

```env
DEBUG=*
NODE_ENV=development
```

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [OpenAI API Documentation](https://platform.openai.com/docs)

### Community Support
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Supabase Discord](https://discord.supabase.com)
- [MongoDB Community](https://community.mongodb.com)

## ✅ Setup Checklist

- [ ] Node.js and npm installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Supabase project created
- [ ] Database tables created
- [ ] RLS policies configured
- [ ] Authentication settings configured
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] OpenAI account created
- [ ] API key generated
- [ ] Development server running
- [ ] Authentication flow tested
- [ ] Database operations tested
- [ ] AI integration tested

---

Your setup is complete! You can now start developing and testing the AI-Powered Resume Tailor application. 