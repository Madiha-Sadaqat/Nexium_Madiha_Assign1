"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { quotes } from "@/data/quote";

const suggestedTopics = [
  "success",
  "motivation",
  "life",
  "happiness",
  "perseverance",
  "leadership",
  "creativity",
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [filteredQuotes, setFilteredQuotes] = useState<string[]>([]);

  const handleGenerate = () => {
    const result = quotes
      .filter((q) => q.topic.toLowerCase() === topic.toLowerCase())
      .slice(0, 3)
      .map((q) => q.quote);
    setFilteredQuotes(result);
  };

  const handleChipClick = (chip: string) => {
    setTopic(chip);
    const result = quotes
      .filter((q) => q.topic.toLowerCase() === chip.toLowerCase())
      .slice(0, 3)
      .map((q) => q.quote);
    setFilteredQuotes(result);
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-blue-200 via-pink-100 to-yellow-100" style={{backgroundSize:'200% 200%'}} />
      {/* Optional overlay for depth */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 w-full max-w-2xl mx-auto bg-white/95 rounded-2xl shadow-2xl border border-gray-200 px-8 py-10 flex flex-col items-center backdrop-blur-md">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">Motivational Quote Generator</h1>
        <p className="text-gray-600 mb-6 text-center max-w-lg">Enter a topic or pick one below to get inspired by 3 motivational quotes!</p>

        {/* Suggested Topics Bar */}
        <div className="flex flex-wrap gap-2 w-full justify-center mb-6">
          {suggestedTopics.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className={`px-4 py-1 rounded-full text-sm font-medium border border-gray-300 bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 
                ${topic === chip ? "bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 text-white border-blue-500 shadow-lg scale-110" : ""}`}
              style={{ minWidth: 90 }}
            >
              {chip.charAt(0).toUpperCase() + chip.slice(1)}
            </button>
          ))}
        </div>

        {/* Input and Button */}
        <div className="flex gap-2 w-full max-w-xl mb-8">
          <Input
            placeholder="Enter topic (e.g., happiness, leadership)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="text-base px-4 py-2 border-2 border-blue-400 rounded-lg bg-blue-50 text-gray-900 font-semibold placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors duration-200"
          />
          <Button
            onClick={handleGenerate}
            className="text-base px-6 py-2 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white rounded-lg shadow-md font-bold transition-colors duration-200"
          >
            Generate
          </Button>
        </div>

        {/* Quotes Display */}
        <div className="flex flex-col gap-6 w-full max-w-xl">
          {filteredQuotes.length > 0 ? (
            filteredQuotes.map((quote, idx) => (
              <Card
                key={idx}
                className="bg-gradient-to-br from-pink-100 via-blue-100 to-yellow-100 shadow-lg border border-gray-200 animate-fade-in rounded-xl transition-transform duration-200 hover:scale-[1.025] hover:shadow-2xl"
                style={{ transition: "transform 0.2s", animationDelay: `${idx * 0.1}s` }}
              >
                <CardContent className="p-6 text-lg text-gray-800 font-medium text-center">
                  <span className="block mb-2 text-blue-600 text-2xl">“</span>
                  {quote}
                  <span className="block mt-2 text-blue-600 text-2xl">”</span>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-base text-center italic">No quotes found for this topic. Try: success, motivation, life, happiness, perseverance, leadership, or creativity.</p>
          )}
        </div>
        <style jsx global>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both;
          }
          .animate-gradient {
            animation: gradientBG 8s ease-in-out infinite alternate;
          }
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
        `}</style>
      </div>
    </main>
  );
}
