const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

// Read existing content
let content = '';
if (fs.existsSync(envPath)) {
  content = fs.readFileSync(envPath, 'utf8');
}

// Add missing variables if they don't exist
const newVars = [
  'SUPABASE_URL=https://koenwbwuzqdgvxanezzd.supabase.co',
  'SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZW53Ynd1enFkZ3Z4YW5lenpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0ODExMTksImV4cCI6MjA2NzA1NzExOX0.7ZCQmvATw7R1aUeqdwiBIKWO0ZOGoqzw30oZcm2ykvM'
];

newVars.forEach(varLine => {
  const varName = varLine.split('=')[0];
  if (!content.includes(varName)) {
    content += '\n' + varLine;
  }
});

// Write back to file
fs.writeFileSync(envPath, content.trim() + '\n');

console.log('✅ Environment variables updated successfully!');
console.log('📄 Updated .env.local file:');
console.log(fs.readFileSync(envPath, 'utf8')); 