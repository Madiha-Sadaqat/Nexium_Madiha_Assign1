"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BlogUrlForm() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<{ title: string; main: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [summarising, setSummarising] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setSummary(null); // Reset summary if new extraction
        setSummaryError("");
      } else {
        setError(data.error || "Unknown error");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch blog content.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSummarise = async () => {
    if (!result) return;
    setSummarising(true);
    setSummaryError("");
    setSummary(null);
    try {
      const res = await fetch("/api/summarise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: result.main }),
      });
      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
      } else {
        setSummaryError(data.error || "Unknown error");
      }
    } catch (err) {
      if (err instanceof Error) {
        setSummaryError(err.message);
      } else {
        setSummaryError("Failed to summarise blog content.");
      }
    } finally {
      setSummarising(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto mt-12">
      <div className="flex flex-col items-center mb-8">
        <div className="text-5xl mb-2 select-none">📄✨</div>
        <h1 className="text-3xl font-extrabold text-primary drop-shadow mb-1 tracking-tight">Blog Summariser</h1>
        <p className="text-lg text-gray-700 font-medium mb-2">Summarize any blog in seconds!</p>
      </div>
      <form onSubmit={handleSubmit} className="w-full glass-card space-y-4 z-10">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter blog URL"
          required
        />
        <Button type="submit" className="w-full main-gradient-btn" disabled={loading}>
          {loading ? "Extracting..." : "Extract Blog Content"}
        </Button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {result && (
        <div className="mt-8 w-full glass-card z-10">
          <h2 className="font-bold text-2xl mb-3 text-primary drop-shadow">{result.title}</h2>
          <div className="mb-6 whitespace-pre-line text-gray-800 text-base leading-relaxed" style={{ maxHeight: 300, overflowY: 'auto' }}>{result.main}</div>
          <Button
            variant="secondary"
            className="mt-2 pulse-on-hover"
            onClick={handleSummarise}
            disabled={summarising}
          >
            {summarising ? "Summarising..." : "Summarise"}
          </Button>
          {summaryError && <div className="text-red-500 mt-2">{summaryError}</div>}
          {summary && (
            <div className="mt-6 p-4 border-l-4 border-blue-500 bg-blue-50/60 rounded backdrop-blur-sm">
              <h3 className="font-semibold mb-2 text-blue-700 text-lg">Summary:</h3>
              <p className="text-blue-900 whitespace-pre-line text-base">{summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}