# N8N AI Resume Tailoring Setup Guide

## 🚀 Overview

This guide will help you set up n8n to enable AI-powered resume tailoring using OpenAI's GPT-4 model.

## 📋 Prerequisites

1. **n8n installed and running** (default: http://localhost:5678)
2. **OpenAI API key** (for GPT-4 access)
3. **Node.js environment** (for running the workflow)

## 🔧 Step 1: Install n8n

```bash
# Install n8n globally
npm install -g n8n

# Start n8n
n8n start
```

## 🔧 Step 2: Import the Workflow

1. Open n8n at http://localhost:5678
2. Click "Import from file"
3. Select the `n8n-workflow.json` file from this project
4. The workflow will be imported with all nodes configured

## 🔧 Step 3: Configure OpenAI Credentials

1. In n8n, go to **Settings** → **Credentials**
2. Click **Add Credential**
3. Select **OpenAI API**
4. Enter your OpenAI API key
5. Save the credential

## 🔧 Step 4: Update the Workflow

1. Open the imported workflow
2. Click on the **AI Resume Tailor** node
3. In the credentials field, select your OpenAI API credential
4. Save the workflow

## 🔧 Step 5: Activate the Workflow

1. Click the **Active** toggle in the workflow
2. The webhook URL will be generated
3. Copy the webhook URL (should be something like: `http://localhost:5678/webhook/tailor-resume`)

## 🔧 Step 6: Update Environment Variables

Update your `.env.local` file with the n8n webhook URL:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/tailor-resume
```

## 🧪 Testing the Integration

1. **Start your Next.js app:**
   ```bash
   cd internship/grand-project/app
   npm run dev
   ```

2. **Start n8n:**
   ```bash
   n8n start
   ```

3. **Test the AI Tailoring:**
   - Go to http://localhost:3000/resume-input
   - Fill out the resume form
   - Click "AI Tailor Resume"
   - Enter a job description
   - Watch the AI tailor your resume!

## 🔧 Workflow Details

### Nodes in the Workflow:

1. **Webhook Trigger** - Receives resume data and job description
2. **Data Processor** - Validates and prepares data for AI
3. **AI Resume Tailor** - GPT-4 processes and tailors the resume
4. **Response Formatter** - Formats the AI response
5. **Webhook Response** - Returns the tailored resume

### AI Processing Features:

- ✅ Keyword matching from job description
- ✅ Quantifiable achievements optimization
- ✅ Relevant skills highlighting
- ✅ Professional language enhancement
- ✅ ATS (Applicant Tracking System) optimization

## 🔧 Customization Options

### Modify AI Behavior:

Edit the **AI Resume Tailor** node to change:
- **Temperature**: 0.7 (creativity level)
- **Max Tokens**: 4000 (response length)
- **System Prompt**: Customize the AI's role and instructions

### Add More AI Features:

1. **Skills Gap Analysis** - Compare user skills with job requirements
2. **Cover Letter Generation** - Create matching cover letters
3. **Interview Preparation** - Generate interview questions based on resume
4. **Salary Negotiation** - Provide salary insights based on experience

## 🔧 Troubleshooting

### Common Issues:

1. **Webhook not accessible:**
   - Ensure n8n is running on port 5678
   - Check firewall settings
   - Verify webhook URL in environment variables

2. **OpenAI API errors:**
   - Verify API key is valid
   - Check API usage limits
   - Ensure GPT-4 access is enabled

3. **Workflow not activating:**
   - Check all nodes are properly connected
   - Verify credentials are set
   - Look for error messages in n8n logs

### Debug Mode:

Enable debug logging in n8n:
```bash
n8n start --debug
```

## 🎯 Next Steps

1. **Deploy n8n** to a cloud service (Railway, Heroku, etc.)
2. **Add more AI features** (cover letters, interview prep)
3. **Integrate with job boards** for automatic job description fetching
4. **Add analytics** to track AI tailoring success rates

## 📊 Monitoring

- **n8n Dashboard**: Monitor workflow executions
- **OpenAI Usage**: Track API usage and costs
- **Application Logs**: Monitor API calls and responses

## 🚀 Production Deployment

For production deployment:

1. **Deploy n8n** to a cloud service
2. **Update webhook URL** in environment variables
3. **Set up monitoring** and error tracking
4. **Configure rate limiting** to prevent abuse
5. **Add authentication** to the webhook endpoint

---

**🎉 Your AI Resume Tailoring system is now ready!** 