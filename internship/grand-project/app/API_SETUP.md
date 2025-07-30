# API Setup Guide

## Environment Variables Required

Create a `.env.local` file in the `app` directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string_here
```

## API Routes Created

### 1. POST `/api/saveResume`
- **Purpose**: Save resume data to both Supabase and MongoDB
- **Body**: `{ user_id, resume_text }`
- **Response**: `{ success: true, supabase_id, mongo_id, message }`

### 2. GET `/api/getResumes`
- **Purpose**: Fetch resumes for a user from both databases
- **Query**: `?user_id=uuid`
- **Response**: `{ success: true, supabase_resumes: [], mongo_resumes: [] }`

### 3. POST `/api/saveHistory`
- **Purpose**: Save history entries to Supabase
- **Body**: `{ user_id, resume_id, job_description, tailored_resume }`
- **Response**: `{ success: true, history_id, message }`

### 4. GET `/api/getHistory`
- **Purpose**: Fetch history with resume details
- **Query**: `?user_id=uuid`
- **Response**: `{ success: true, history: [] }`

## Frontend Integration Example

```typescript
// Save resume
const saveResume = async (user_id: string, resume_text: string) => {
  const response = await fetch('/api/saveResume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, resume_text })
  });
  return response.json();
};

// Get resumes
const getResumes = async (user_id: string) => {
  const response = await fetch(`/api/getResumes?user_id=${user_id}`);
  return response.json();
};

// Save history
const saveHistory = async (user_id: string, resume_id: string, job_description: string, tailored_resume: string) => {
  const response = await fetch('/api/saveHistory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, resume_id, job_description, tailored_resume })
  });
  return response.json();
};

// Get history
const getHistory = async (user_id: string) => {
  const response = await fetch(`/api/getHistory?user_id=${user_id}`);
  return response.json();
};
```

## Database Schema

### Supabase Tables

**resumes table:**
- `id` (uuid, primary key)
- `user_id` (uuid)
- `resume_text` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**history table:**
- `id` (uuid, primary key)
- `user_id` (uuid)
- `resume_id` (uuid, foreign key to resumes.id)
- `job_description` (text)
- `tailored_resume` (text)
- `created_at` (timestamptz)

### MongoDB Collection

**resumes collection:**
- `_id` (ObjectId)
- `user_id` (string)
- `resume_text` (string)
- `created_at` (Date)
- `updated_at` (Date) 