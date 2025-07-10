"use client";
import { useState } from "react";

export default function BlogUrlForm() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<{ title: string; main: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        </div>
      )}
    </div>
  );
}