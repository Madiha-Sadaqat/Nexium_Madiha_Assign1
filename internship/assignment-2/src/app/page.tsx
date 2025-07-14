import BlogUrlForm from "@/components/BlogUrlForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-200 via-blue-100 to-blue-200 relative overflow-x-hidden">
      <div className="absolute inset-0 z-0 backdrop-blur-[2px] pointer-events-none" />
      <section className="z-10 flex flex-col items-center w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 drop-shadow-lg tracking-tight">
          Turn Any Blog into Insight — <span className="text-blue-600">in English & Urdu</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 text-center mb-8 max-w-2xl">
          Enter a blog URL to generate an AI summary and translate it to Urdu instantly.
        </p>
        <div className="w-full max-w-xl">
          <BlogUrlForm />
        </div>
      </section>
      {/* Features Section */}
      <section className="w-full flex flex-col items-center mt-8 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">Unique Features</h2>
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-center">
          {/* Simulated AI */}
          <div className="flex-1 min-w-[220px] max-w-xs bg-white rounded-2xl p-6 flex flex-col items-center border border-white/40 transition-transform duration-300 hover:scale-105 hover:-rotate-2">
            <span className="text-4xl mb-2">🧠</span>
            <span className="text-lg font-semibold mb-1 text-gray-900">Simulated AI</span>
            <span className="text-gray-600 text-center text-sm">Get instant, smart blog summaries powered by advanced AI models.</span>
          </div>
          {/* Urdu Translation */}
          <div className="flex-1 min-w-[220px] max-w-xs bg-white rounded-2xl p-6 flex flex-col items-center border border-white/40 transition-transform duration-300 hover:scale-105 hover:rotate-2">
            <span className="text-4xl mb-2">🌐</span>
            <span className="text-lg font-semibold mb-1 text-gray-900">Urdu Translation</span>
            <span className="text-gray-600 text-center text-sm">Translate summaries to Urdu instantly, including beautiful Nastaliq font support.</span>
          </div>
          {/* Cloud Storage */}
          <div className="flex-1 min-w-[220px] max-w-xs bg-white rounded-2xl p-6 flex flex-col items-center border border-white/40 transition-transform duration-300 hover:scale-105 hover:-rotate-1">
            <span className="text-4xl mb-2">💾</span>
            <span className="text-lg font-semibold mb-1 text-gray-900">Cloud Storage</span>
            <span className="text-gray-600 text-center text-sm">Save and access your summarized blogs securely in the cloud.</span>
          </div>
        </div>
      </section>
    </main>
  );
}