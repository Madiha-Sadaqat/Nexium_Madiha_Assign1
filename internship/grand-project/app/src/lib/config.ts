// Environment-aware configuration
export const config = {
  // API URL - use Vercel URL in production, localhost in development
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://resume-tailor-ecru.vercel.app'
    : 'http://localhost:3000',
  
  // Auth callback URL - use Vercel URL in production, localhost in development
  authCallbackUrl: process.env.NODE_ENV === 'production'
    ? 'https://resume-tailor-ecru.vercel.app/auth/callback'
    : 'http://localhost:3000/auth/callback',
  
  // Webhook URL - use Vercel URL in production, localhost in development
  webhookUrl: process.env.NODE_ENV === 'production'
    ? 'https://resume-tailor-ecru.vercel.app/api/webhook/tailor-resume'
    : 'http://localhost:5678/webhook/tailor-resume',
  
  // Environment detection
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Log configuration for debugging
console.log('Environment:', process.env.NODE_ENV);
console.log('API URL:', config.apiUrl);
console.log('Auth Callback URL:', config.authCallbackUrl); 