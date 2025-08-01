# 🔧 Alternative n8n Setup Guide

## 🚨 Issue: n8n Global Installation Failed

The global installation failed due to network connectivity and permission issues. Here are alternative approaches:

## 🐳 **Option 1: Docker (Recommended)**

### Install Docker Desktop
1. Download from: https://www.docker.com/products/docker-desktop/
2. Install and restart your computer
3. Open Docker Desktop

### Run n8n with Docker
```bash
# In your project directory
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
```

### Access n8n
- Open browser: http://localhost:5678
- Create your account
- Set up your first workflow

## 📦 **Option 2: npx (No Installation)**

### Run n8n directly with npx
```bash
# In your project directory
npx n8n start
```

### Access n8n
- Open browser: http://localhost:5678
- Create your account
- Set up your first workflow

## 🔧 **Option 3: Local Installation**

### Try with different flags
```bash
# Force installation
npm install -g n8n --force

# Or with legacy peer deps
npm install -g n8n --legacy-peer-deps

# Or clear cache first
npm cache clean --force
npm install -g n8n
```

## 🎯 **Recommended Workflow Setup**

### 1. Create n8n Workflow for Resume Tailoring

Once n8n is running, create this workflow:

```
Webhook Trigger → OpenAI → HTTP Request → Response
```

### 2. Configure Webhook
- **Method**: POST
- **Path**: `/resume-tailor`
- **Authentication**: None (for testing)

### 3. Add OpenAI Node
- **Model**: gpt-4
- **Prompt**: Resume tailoring prompt
- **Temperature**: 0.7

### 4. Add HTTP Request Node
- **Method**: POST
- **URL**: Your Next.js API endpoint
- **Body**: AI response + original data

### 5. Test Workflow
- Send test data to webhook
- Verify AI processing
- Check response

## 🔄 **Integration with Your App**

### Update API Route
```typescript
// In /api/tailorResume/route.ts
export async function POST(request: NextRequest) {
  try {
    const { resumeData, jobDescription } = await request.json();
    
    // Call n8n webhook instead of OpenAI directly
    const n8nResponse = await fetch('http://localhost:5678/webhook/resume-tailor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData, jobDescription })
    });
    
    const result = await n8nResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    // Error handling
  }
}
```

## 🚀 **Quick Start (Recommended)**

1. **Install Docker Desktop**
2. **Run n8n**: `docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n`
3. **Access**: http://localhost:5678
4. **Create workflow** for resume tailoring
5. **Update your API** to call n8n webhook
6. **Test the complete flow**

## 📊 **Benefits of This Approach**

- ✅ **No complex installation** - Docker handles everything
- ✅ **Isolated environment** - No conflicts with existing packages
- ✅ **Easy cleanup** - Just stop Docker container
- ✅ **Production ready** - Can be deployed with Docker
- ✅ **Fulfills requirements** - Uses n8n for AI workflow automation

## 🎯 **Next Steps**

1. Choose one of the installation methods above
2. Set up the n8n workflow
3. Update your API to use n8n webhook
4. Test the complete AI workflow
5. Deploy to Vercel

**This approach will fulfill your n8n requirement while avoiding installation issues!** 