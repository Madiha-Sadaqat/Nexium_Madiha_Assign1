"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const quotes = [
  {
    topic: "success",
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  },
  {
    topic: "success",
    text: "Success usually comes to those who are too busy to be looking for it.",
  },
  {
    topic: "success",
    text: "Don't be afraid to give up the good to go for the great.",
  },
  {
    topic: "life",
    text: "Life is 10% what happens to us and 90% how we react to it.",
  },
  {
    topic: "life",
    text: "Keep your face always toward the sunshine—and shadows will fall behind you.",
  },
  {
    topic: "life",
    text: "In the middle of every difficulty lies opportunity.",
  },
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [filteredQuotes, setFilteredQuotes] = useState<string[]>([]);

  const handleGenerate = () => {
    const result = quotes
      .filter((q) => q.topic.toLowerCase() === topic.toLowerCase())
      .slice(0, 3)
      .map((q) => q.text);

    setFilteredQuotes(result);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-6">
      <h1 className="text-2xl font-bold">Motivational Quote Generator</h1>

      <div className="flex gap-2 w-full max-w-md">
        <Input
          placeholder="Enter topic (e.g., success, life)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Button onClick={handleGenerate}>Generate</Button>
      </div>

      <div className="flex flex-col gap-4 mt-6 w-full max-w-md">
        {filteredQuotes.length > 0 ? (
          filteredQuotes.map((quote, idx) => (
            <Card key={idx}>
              <CardContent className="p-4 text-sm">{quote}</CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">No quotes yet...</p>
        )}
      </div>
    </main>
  );
}
