"use client";

import { useState } from "react";

const quotes = [
  "Believe you can and you're halfway there.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn’t just find you. You have to go out and get it.",
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [displayQuotes, setDisplayQuotes] = useState<string[]>([]);

  const generateQuotes = () => {
    const shuffled = quotes.sort(() => 0.5 - Math.random());
    setDisplayQuotes(shuffled.slice(0, 3));
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 bg-gray-50 text-center">
      <h1 className="text-3xl font-bold text-gray-800">
        Motivational Quote Generator
      </h1>

      <input
        type="text"
        placeholder="Enter a topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="border rounded px-4 py-2 w-80 text-black"
      />

      <button
        onClick={generateQuotes}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Generate Quotes
      </button>

      <div className="mt-6 space-y-4">
        {displayQuotes.map((quote, index) => (
          <p key={index} className="text-gray-700 italic">
            "{quote}"
          </p>
        ))}
      </div>
    </main>
  );
}
