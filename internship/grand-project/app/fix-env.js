const fs = require('fs');

const envContent = `NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://koenwbwuzqdgvxanezzd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZW53Ynd1enFkZ3Z4YW5lenpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0ODExMTksImV4cCI6MjA2NzA1NzExOX0.7ZCQmvATw7R1aUeqdwiBIKWO0ZOGoqzw30oZcm2ykvM
SUPABASE_URL=https://koenwbwuzqdgvxanezzd.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZW53Ynd1enFkZ3Z4YW5lenpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0ODExMTksImV4cCI6MjA2NzA1NzExOX0.7ZCQmvATw7R1aUeqdwiBIKWO0ZOGoqzw30oZcm2ykvM
MONGODB_URI=mongodb+srv://madihasadaqat003:bsef22m518@nexium-mongo.okgdg75.mongodb.net/resume-tailor?retryWrites=true&w=majority&appName=nexium-mongo
N8N_WEBHOOK_URL=http://localhost:5678/webhook/tailor-resume
`;

fs.writeFileSync('.env.local', envContent, 'utf8');
console.log('✅ .env.local file created successfully!');
console.log('📄 File contents:');
console.log(fs.readFileSync('.env.local', 'utf8')); 