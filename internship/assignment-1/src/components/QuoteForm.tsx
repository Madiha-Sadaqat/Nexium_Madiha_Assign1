"use client";

import { useState } from "react";
import { quotes } from "../data/quote";

export default function QuoteForm() {
  const [topic, setTopic] = useState("");
  const [filteredQuotes, setFilteredQuotes] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = quotes
      .filter((q) => q.topic.toLowerCase() === topic.toLowerCase())
      .map((q) => q.quote)
      .slice(0, 3);

    setFilteredQuotes(result);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Enter topic e.g. motivation"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button 
          type="submit"
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
        >
          Get Quotes
        </button>
      </form>
      <div className="space-y-2">
        {filteredQuotes.length > 0 ? (
          filteredQuotes.map((quote, index) => (
            <div key={index} className="p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">
              <p className="text-white text-lg leading-relaxed">"{quote}"</p>
            </div>
          ))
        ) : (
          <p className="text-white/60 text-sm text-center">No quotes found for this topic. Try: success, motivation, or life</p>
        )}
      </div>
    </div>
  );
}
