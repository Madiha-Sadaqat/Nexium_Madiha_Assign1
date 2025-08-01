# 🎯 AI-Powered Resume Tailor

A modern, AI-powered web application for creating and tailoring professional resumes. Built with Next.js, TypeScript, and integrated with Supabase and MongoDB for robust data management.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Setup Instructions](#-setup-instructions)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

## ✨ Features

### 🔐 Authentication
- **Magic Link Authentication** - Secure email-based login
- **Session Management** - Automatic session handling
- **Protected Routes** - User-specific data access

### 📝 Resume Management
- **Multi-Section Forms** - Personal info, experience, education, skills
- **Real-time Validation** - Form completion tracking
- **Auto-save Drafts** - Never lose your progress
- **Edit & Update** - Modify existing resumes

### 🤖 AI-Powered Tailoring
- **Smart Resume Optimization** - AI-driven content enhancement
- **Job-Specific Customization** - Tailor resumes for specific positions
- **Skill Optimization** - Intelligent skill matching and enhancement
- **Professional Summary Generation** - AI-crafted summaries

### 📊 Data Management
- **Dual Database** - Supabase (PostgreSQL) + MongoDB
- **Cross-Platform Sync** - Seamless data synchronization
- **History Tracking** - Complete resume version history
- **Export Options** - PDF and DOCX generation

### 🎨 User Experience
- **Dark/Light Theme** - Toggle between themes
- **Responsive Design** - Works on all devices
- **Progress Tracking** - Visual completion indicators
- **Loading States** - Smooth user interactions

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Icons** - Beautiful icon library
- **Framer Motion** - Smooth animations

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Supabase** - PostgreSQL database + authentication
- **MongoDB** - NoSQL database for flexibility
- **OpenAI API** - AI-powered resume tailoring

### Development Tools
- **ESLint** - Code quality
- **PostCSS** - CSS processing
- **Turbopack** - Fast development builds

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Databases     │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   Supabase      │
│                 │    │                 │    │   + MongoDB     │
│ • React         │    │ • REST APIs     │    │                 │
│ • TypeScript    │    │ • Auth Middleware│   │ • PostgreSQL    │
│ • Tailwind CSS  │    │ • OpenAI        │    │ • NoSQL         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎬 Live Demo & Walkthrough

### 📹 Application Walkthrough
Watch a complete demonstration of the AI-Powered Resume Tailor in action:

[![Resume Tailor Demo](https://img.shields.io/badge/Watch%20Demo-Loom%20Video-blue?style=for-the-badge&logo=loom)](https://www.loom.com/share/7e94931daeda4d9490e976d3ae3dbc75?sid=2f7f27ef-7063-41e4-8c77-b903e4f4ba54)

**Demo Features Covered:**
- 🔐 Magic Link Authentication
- 📝 Multi-section Resume Builder
- 🤖 AI-Powered Resume Tailoring
- 📄 PDF/DOCX Export
- 📱 Mobile Responsive Design
- 🌙 Dark/Light Theme Toggle

### 🌐 Live Application
**Production URL**: https://resume-tailor-ecru.vercel.app

**Try it yourself:**
1. Visit the live application
2. Sign in with your email (magic link)
3. Create your first resume
4. Experience AI-powered tailoring
5. Export your professional resume

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- MongoDB Atlas account
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd internship/grand-project/app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure your environment variables**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

5. **Start development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

## ⚙️ Setup Instructions

### 1. Database Setup

#### Supabase Setup
1. Create a new Supabase project
2. Create the following tables:

**resumes table:**
```sql
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mongo_id TEXT
);

-- Enable RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own resumes" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON resumes
  FOR DELETE USING (auth.uid() = user_id);
```

**history table:**
```sql
CREATE TABLE history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  resume_id UUID REFERENCES resumes(id),
  action TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own history" ON history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" ON history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### MongoDB Setup
1. Create a MongoDB Atlas cluster
2. Create a database named `resume-tailor`
3. Create a collection named `resumes`
4. Set up network access and database users

### 2. Authentication Setup

1. **Enable Email Auth in Supabase**
   - Go to Authentication > Settings
   - Enable "Enable email confirmations"
   - Configure email templates

2. **Set up Auth Callback**
   - Add `http://localhost:3000/auth/callback` to your Supabase auth settings
   - For production, add your domain

### 3. OpenAI Setup

1. Create an OpenAI account
2. Generate an API key
3. Add the key to your environment variables

## 📚 API Documentation

### Authentication Endpoints

#### `POST /api/auth/callback`
Handles Supabase magic link authentication.

### Resume Management Endpoints

#### `POST /api/saveResume`
Saves a resume to both Supabase and MongoDB.

**Request Body:**
```json
{
  "user_id": "uuid",
  "title": "Resume Title",
  "content": {
    "personal": {...},
    "experience": [...],
    "education": [...],
    "skills": {...}
  }
}
```

#### `GET /api/getResumes?user_id={user_id}`
Retrieves all resumes for a user.

#### `DELETE /api/deleteResume`
Deletes a resume from both databases.

#### `POST /api/tailorResume`
AI-powered resume tailoring.

**Request Body:**
```json
{
  "resumeData": {...},
  "jobDescription": "Job description text"
}
```

### History Endpoints

#### `POST /api/saveHistory`
Saves a history entry.

#### `GET /api/getHistory?user_id={user_id}`
Retrieves user's resume history.

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
```bash
npm install -g vercel
vercel login
```

2. **Deploy**
```bash
vercel --prod
```

3. **Set Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Update Supabase auth callback URLs

### Environment Variables for Production

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key

# MongoDB
MONGODB_URI=your_production_mongodb_uri

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Next.js
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

## 📁 Project Structure

```
internship/grand-project/
├── app/                          # Main application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/             # API routes
│   │   │   │   ├── saveResume/
│   │   │   │   ├── getResumes/
│   │   │   │   ├── deleteResume/
│   │   │   │   ├── tailorResume/
│   │   │   │   ├── saveHistory/
│   │   │   │   └── getHistory/
│   │   │   ├── auth/            # Authentication
│   │   │   │   └── callback/
│   │   │   ├── login/           # Login page
│   │   │   ├── dashboard/       # Dashboard
│   │   │   ├── resume-input/    # Resume form
│   │   │   ├── output-page/     # Resume display
│   │   │   ├── history/         # History page
│   │   │   ├── features/        # Features page
│   │   │   ├── templates/       # Resume templates
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── page.tsx         # Home page
│   │   │   ├── globals.css      # Global styles
│   │   │   └── DarkModeProvider.tsx
│   │   ├── components/          # Reusable components
│   │   ├── lib/                 # Utilities
│   │   │   ├── auth-context.tsx
│   │   │   ├── mongodb.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── utils.ts
│   │   │   └── resume-generator.ts
│   │   └── data/               # Data models
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── next.config.ts
├── docs/                       # Documentation
│   ├── PRD.md                 # Product Requirements
│   └── wireframes/            # UI wireframes
├── api/                       # Standalone API (if needed)
└── README.md                  # This file
```

## 🎯 Key Features Explained

### AI Resume Tailoring
The application uses OpenAI's GPT models to intelligently tailor resumes based on job descriptions. The AI:

1. **Analyzes the job description** for key requirements
2. **Enhances relevant skills** and experience
3. **Optimizes content** for the specific role
4. **Generates professional summaries** tailored to the position

### Dual Database Architecture
- **Supabase (PostgreSQL)**: Primary database for user data and authentication
- **MongoDB**: Secondary database for flexible document storage
- **Cross-referencing**: IDs are stored in both databases for consistency

### Theme System
- **Dark/Light Mode**: Toggle between themes
- **Persistent**: Theme preference is saved in localStorage
- **Consistent**: Applied across all pages

### Form Management
- **Multi-step**: Progressive form completion
- **Validation**: Real-time form validation
- **Auto-save**: Automatic draft saving
- **Progress tracking**: Visual completion indicators

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting (if configured)

### Testing

```bash
# Run tests (if configured)
npm test

# Run type checking
npx tsc --noEmit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📹 Creating Your Own Loom Walkthrough

### How to Record a Demo Video

1. **Sign up for Loom** (free at [loom.com](https://www.loom.com))
2. **Install the Loom extension** for your browser
3. **Prepare your demo script**:
   - Authentication flow
   - Resume creation process
   - AI tailoring demonstration
   - Export functionality
   - Mobile responsiveness
   - Theme toggle

4. **Record your screen**:
   - Start with the login page
   - Show the magic link process
   - Walk through resume creation
   - Demonstrate AI tailoring
   - Show PDF/DOCX export
   - Test mobile view
   - Toggle dark/light theme

5. **Add voice narration** explaining each feature
6. **Edit and trim** the video if needed
7. **Share the Loom link** in your README

### Demo Script Template

```
🎬 Demo Script (5-7 minutes):

1. Introduction (30s)
   - "Welcome to the AI-Powered Resume Tailor"
   - "Built with Next.js, TypeScript, and OpenAI"

2. Authentication (1m)
   - Show login page
   - Enter email address
   - Demonstrate magic link process
   - Show dashboard after login

3. Resume Creation (2m)
   - Navigate to resume input
   - Fill out personal information
   - Add work experience
   - Add education
   - Add skills and certifications
   - Show progress tracking

4. AI Tailoring (1.5m)
   - Click "AI Tailor Resume"
   - Configure job requirements
   - Show AI processing
   - Display tailored results
   - Compare before/after

5. Export & History (1m)
   - Generate PDF resume
   - Generate DOCX resume
   - Show history page
   - Demonstrate version tracking

6. Mobile & Theme (30s)
   - Show mobile responsive design
   - Toggle dark/light theme
   - Highlight responsive features

7. Conclusion (30s)
   - Summarize key features
   - Mention tech stack
   - Call to action
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the [Issues](../../issues) page
2. Review the [Documentation](./docs/)
3. Contact the development team

## 🎉 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Supabase** - For the excellent backend-as-a-service
- **OpenAI** - For the powerful AI capabilities
- **Tailwind CSS** - For the utility-first CSS framework

---

**Built with ❤️ by the Nexium Development Team**