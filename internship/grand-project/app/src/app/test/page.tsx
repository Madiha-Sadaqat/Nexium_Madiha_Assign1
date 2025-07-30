"use client";
import { useState } from "react";

export default function TestPage() {
  const [result, setResult] = useState<string>("");

  const testSaveResume = async () => {
    try {
      const response = await fetch('/api/saveResume', {
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
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testGetResumes = async () => {
    try {
      const response = await fetch('/api/getResumes?user_id=test-user-123');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testSaveHistory = async () => {
    try {
      const response = await fetch('/api/saveHistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'test-user-123',
          resume_id: 'test-resume-id',
          job_description: 'Software Engineer at Google',
          tailored_resume: 'Tailored resume content...'
        })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testGetHistory = async () => {
    try {
      const response = await fetch('/api/getHistory?user_id=test-user-123');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={testSaveResume}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Save Resume
          </button>
          
          <button 
            onClick={testGetResumes}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Get Resumes
          </button>
          
          <button 
            onClick={testSaveHistory}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Test Save History
          </button>
          
          <button 
            onClick={testGetHistory}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Test Get History
          </button>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">API Response:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {result || "Click a button to test the API endpoints..."}
          </pre>
        </div>
      </div>
    </div>
  );
} 