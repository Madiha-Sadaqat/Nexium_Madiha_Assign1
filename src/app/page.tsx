'use client';

import QuoteForm from '../../internship/assignment-1/src/components/QuoteForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Quote Generator
            </h1>
            <p className="text-white/80 text-lg">
              Enter a topic to discover inspiring quotes
            </p>
          </div>

          <QuoteForm />

          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              Available topics: success, motivation, life
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
