# Resume Tailor — Product Requirements Document (PRD)

## Project Title
Resume Tailor – AI-Powered Resume Customization

## 1. Problem Statement
Job seekers often submit the same generic resume to multiple job applications, reducing their chances of getting shortlisted. Tailoring resumes for each job is time-consuming and difficult. There is a need for a tool that can personalize resumes instantly based on job descriptions.

## 2. Solution Overview
Resume Tailor allows users to upload or paste their resume and a job description. Using AI, it suggests edits, rewrites sections, and tailors the resume to better match the job. The final result can be downloaded or emailed.

## 3. Target Users
- Fresh graduates looking for internships or jobs
- Experienced professionals seeking new roles
- Career switchers tailoring resumes for new industries

## 4. Key Features
- Magic link email login (Supabase auth)
- Upload or paste resume content
- Paste job description
- AI-generated tailored resume
- Option to edit AI output
- Save/download result as PDF
- View/edit history (stored in MongoDB)
- Real-time chat with AI assistant

## 5. Success Metrics
- Successful logins
- Resumes tailored and downloaded
- User retention (repeat usage)
- Reduced time to tailor resume

## 6. Tech Stack
- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Supabase (auth, storage), MongoDB (resume logs)
- **AI:** OpenAI via n8n logic
- **CI/CD & Hosting:** GitHub + Vercel
- **Auth:** Magic Link Email Login

## 7. User Flow
1. User signs up/logs in via magic link
2. Uploads/pastes resume
3. Pastes job description
4. Hits "Tailor My Resume"
5. Receives AI-generated tailored resume
6. Edits and downloads result

## Additional User Stories
- As a user, I can sign up/login with my email (magic link).
- As a user, I can input my resume details and a target job description.
- As a user, I can generate a tailored resume using AI.
- As a user, I can preview, edit, and download my resume.
- As a user, I can view my resume history.
- As an admin, I can view usage analytics (optional).

## Additional Success Criteria
- Users can log in and generate at least one tailored resume.
- Resume tailoring is accurate and relevant to the job description.
- Users can download resumes and view history. 

## Wireframes (Low-Fidelity)
Wireframes for all main screens are available in `/grand-project/docs/wireframes/`:
- login-page.jpg
- dashboard.jpg
- resume-input-form.jpg
- AI-output-page.jpg
- history-page.jpg



