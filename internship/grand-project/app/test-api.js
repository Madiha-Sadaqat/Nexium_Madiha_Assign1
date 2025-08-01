// Test script for API endpoints
const API_BASE = 'https://resume-tailor-ecru.vercel.app/api';

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  // Test 1: Save Resume
  console.log('1. Testing POST /api/saveResume');
  try {
    const saveResponse = await fetch(`${API_BASE}/saveResume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'test-user-123',
        resume_text: JSON.stringify({
          title: 'Test Resume',
          content: { name: 'Test User', email: 'test@example.com' }
        })
      })
    });
    
    const saveResult = await saveResponse.json();
    console.log('✅ Save Resume Result:', saveResult);
    
    if (saveResult.success) {
      // Test 2: Get Resumes
      console.log('\n2. Testing GET /api/getResumes');
      const getResponse = await fetch(`${API_BASE}/getResumes?user_id=test-user-123`);
      const getResult = await getResponse.json();
      console.log('✅ Get Resumes Result:', getResult);
      
      // Test 3: Save History (if we have a resume_id)
      if (saveResult.supabase_id) {
        console.log('\n3. Testing POST /api/saveHistory');
        const historyResponse = await fetch(`${API_BASE}/saveHistory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: 'test-user-123',
            resume_id: saveResult.supabase_id,
            job_description: 'Software Engineer at Google',
            tailored_resume: 'Tailored resume content...'
          })
        });
        
        const historyResult = await historyResponse.json();
        console.log('✅ Save History Result:', historyResult);
        
        // Test 4: Get History
        console.log('\n4. Testing GET /api/getHistory');
        const getHistoryResponse = await fetch(`${API_BASE}/getHistory?user_id=test-user-123`);
        const getHistoryResult = await getHistoryResponse.json();
        console.log('✅ Get History Result:', getHistoryResult);
      }
    }
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
  }
}

// Run the test
testAPI(); 