"use client";
import { useState } from "react";

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
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter blog URL"
          className="input input-bordered w-full"
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Extracting..." : "Extract Blog Content"}
        </button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-bold text-lg mb-2">{result.title}</h2>
          <p>{result.main}</p>
          <button
            className="btn btn-secondary mt-4"
            onClick={handleSummarise}
            disabled={summarising}
          >
            {summarising ? "Summarising..." : "Summarise"}
          </button>
          {summaryError && <div className="text-red-500 mt-2">{summaryError}</div>}
          {summary && (
            <div className="mt-4 p-3 border rounded bg-white">
              <h3 className="font-semibold mb-1">Summary:</h3>
              <p>{summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}