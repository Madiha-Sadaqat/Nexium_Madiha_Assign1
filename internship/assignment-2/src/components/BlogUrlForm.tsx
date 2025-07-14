"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";

// Urdu dictionary for word/phrase replacement
const urduDictionary: Record<string, string> = {
  blog: "بلاگ",
  summary: "خلاصہ",
  technology: "ٹیکنالوجی",
  education: "تعلیم",
  information: "معلومات",
  people: "لوگ",
  world: "دنیا",
  provides: "فراہم کرتا ہے",
  about: "کے بارے میں",
  and: "اور",
  the: "دی",
  is: "ہے",
  are: "ہیں",
  for: "کے لئے",
  american: "امریکی",
  dream: "خواب",
  incomplete: "نامکمل",
  until: "جب تک نہ",
  we: "ہم",
  share: "شئیر کریں",
  it: "یہ",
  with: "کے ساتھ",
  our: "ہمارا",
  fellow: "ساتھی",
  americans: "امریکی لوگ",
  asked: "پوچھا",
  personally: "ذاتی طور پر",
  meant: "مراد",
  to: "کو",
  them: "ان کو",
  he: "وہ",
  wrote: "لکھا",
  all: "سب",
  down: "نیچے",
  following: "مندرجہ ذیل",
  drawn: "لیا گیا",
  from: "سے",
  a: "ایک",
  speech: "تقریر",
  delivered: "پیش کی",
  today: "آج",
  at: "پر",
  union: "یونین",
  great: "عظیم",
  hall: "ہال",
  in: "میں",
  new: "نیا",
  york: "یورک",
  city: "شہر",
};

function translateToUrdu(text: string): string {
  return text.split(/(\b)/).map(word => {
    const lower = word.toLowerCase();
    return urduDictionary[lower] ? urduDictionary[lower] : word;
  }).join("");
}

export default function BlogUrlForm() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<{ title: string; main: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [summarising, setSummarising] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [urduSummary, setUrduSummary] = useState<string | null>(null);
  const [aiUrduSummary, setAiUrduSummary] = useState<string | null>(null);
  const [aiUrduLoading, setAiUrduLoading] = useState(false);
  const [aiUrduError, setAiUrduError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setSummary(null);
    setSummaryError("");
    setUrduSummary(null);
    setAiUrduSummary(null);
    setAiUrduError("");

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        // Save extracted blog to MongoDB
        try {
          const saveRes = await fetch("/api/saveBlog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, title: data.title, main: data.main }),
          });
          const saveData = await saveRes.json();
          if (saveRes.ok) {
            toast.success("Extracted blog saved to MongoDB!");
          } else {
            toast.error(saveData.error || "Failed to save blog to MongoDB");
          }
        } catch (e) {
          toast.error("MongoDB error: " + (e instanceof Error ? e.message : "Unknown error"));
        }
      } else {
        setError(data.error || "Unknown error");
      }
    } catch {
      setError("Failed to fetch blog content.");
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
        // Save to Supabase
        try {
          const { error } = await supabase.from("summaries").insert([
            {
              url,
              title: result.title,
              summary_en: data.summary,
            },
          ]);
          if (error) {
            toast.error("Failed to save summary to Supabase");
          } else {
            toast.success("Summary saved to Supabase!");
          }
        } catch (e) {
          toast.error("Supabase error: " + (e instanceof Error ? e.message : "Unknown error"));
        }
      } else {
        setSummaryError(data.error || "Unknown error");
      }
    } catch {
      setSummaryError("Failed to summarise blog content.");
    } finally {
      setSummarising(false);
    }
  };

  const trendingBlogs = [
    "https://blog.codinghorror.com/",
    "https://joelonsoftware.com/",
    "https://css-tricks.com/",
    "https://daringfireball.net/",
    "https://waitbutwhy.com/",
    "https://seths.blog/",
    "https://martinfowler.com/bliki/",
    "https://paulgraham.com/articles.html",
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto mt-0">
      <form onSubmit={handleSubmit} className={`w-full glass-card space-y-4 z-10 relative transition-all duration-300 ${showSuggestions && url ? 'min-h-[340px]' : ''}`}>
        <div className="flex flex-col items-center mb-4">
          <span className="text-2xl md:text-3xl font-bold mb-2 select-none text-gray-700">Blog Summariser✨</span>
        </div>
        <div className="relative">
          <Input
          type="url"
          value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setResult(null);
              setSummary(null);
              setSummaryError("");
              setUrduSummary(null);
              setAiUrduSummary(null);
              setAiUrduError("");
              setShowSuggestions(true);
            }}
            onFocus={() => url && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="Paste Blog URL Here..."
          required
        />
          {showSuggestions && url && (
            <div className="absolute left-0 right-0 z-30 bg-white border rounded-lg shadow-lg mt-2 max-h-64 overflow-y-auto p-1">
              {trendingBlogs.filter(blog => blog.includes(url)).length === 0 && (
                <div className="px-4 py-2 text-gray-400 text-sm">No suggestions</div>
              )}
              {trendingBlogs.filter(blog => blog.includes(url)).map((blog) => (
                <div
                  key={blog}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm rounded"
                  onMouseDown={() => {
                    setUrl(blog);
                    setShowSuggestions(false);
                  }}
                >
                  {blog}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button type="submit" className="w-full main-gradient-btn" disabled={loading}>
          {loading ? "Extracting..." : "Summarize & Translate"}
        </Button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {result && (
        <div className="mt-8 w-full z-10 flex flex-col items-center">
          <div className="glass-card w-full max-w-xl mb-6 flex flex-col relative" style={{ boxShadow: '0 0 0 4px #60a5fa33' }}>
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-blue-400" />
            <h2 className="font-bold text-2xl mb-3 text-primary drop-shadow pl-4 pt-2">{result.title}</h2>
            <div className="whitespace-pre-line text-gray-800 text-base leading-relaxed pl-4 pr-2 pb-4" style={{ maxHeight: 300, overflowY: 'auto' }}>{result.main.trim()}</div>
          </div>
          <Button
            type="button"
            className="mt-2 bg-gradient-to-r from-pink-500 via-pink-400 to-fuchsia-500 hover:from-pink-600 hover:via-pink-500 hover:to-fuchsia-600 text-white font-semibold pulse-on-hover"
            onClick={handleSummarise}
            disabled={summarising}
          >
            {summarising ? "Summarising..." : "Summarise"}
          </Button>
          {summaryError && <div className="text-red-500 mt-2">{summaryError}</div>}
          {/* Summary Cards Layout */}
          {(summarising || aiUrduLoading) && (
            <div className="flex justify-center items-center w-full h-32 mt-8">
              <div className="animate-pulse w-16 h-16 rounded-full bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 opacity-60" />
            </div>
          )}
          {summary && (
            <div className="flex flex-col gap-6 mt-8 w-full items-center">
              {/* English Summary Card */}
              <div className="glass-card w-full max-w-xl relative flex flex-col" style={{ boxShadow: '0 0 16px 0 #ec489966' }}>
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-pink-500" />
                <h3 className="font-semibold mb-2 text-pink-700 text-lg pl-4 pt-2">Summary</h3>
                <div className="text-pink-900 whitespace-pre-line text-base overflow-y-auto pl-4 pr-2 pb-4" style={{ maxHeight: 200 }}>{summary}</div>
                <div className="flex gap-2 mt-4 pl-4">
                  <Button type="button" size="sm" className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300" onClick={() => navigator.clipboard.writeText(summary)}>
                    Copy
                  </Button>
                </div>
              </div>
              {/* Urdu Dictionary Summary Card */}
              {urduSummary && (
                <div className="glass-card w-full max-w-xl relative flex flex-col" style={{ boxShadow: '0 0 16px 0 #22c55e66' }}>
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-green-500" />
                  <h3 className="font-semibold mb-2 text-green-700 text-lg pl-4 pt-2">Urdu (Dictionary)</h3>
                  <div className="text-green-900 whitespace-pre-line text-base overflow-y-auto pl-4 pr-2 pb-4" style={{ maxHeight: 200 }}>{urduSummary}</div>
                  <div className="flex gap-2 mt-4 pl-4">
                    <Button type="button" size="sm" className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300" onClick={() => navigator.clipboard.writeText(urduSummary)}>
                      Copy
                    </Button>
                  </div>
                </div>
              )}
              {/* Urdu AI Summary Card */}
              {(aiUrduSummary || aiUrduError) && (
                <div className="glass-card w-full max-w-xl relative flex flex-col" style={{ boxShadow: '0 0 16px 0 #a21caf66' }}>
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-purple-700" />
                  <h3 className="font-semibold mb-2 text-purple-700 text-lg pl-4 pt-2">Urdu (AI)</h3>
                  {aiUrduError && <div className="text-red-500 mb-2 pl-4">{aiUrduError}</div>}
                  {aiUrduSummary && (
                    <div className="text-purple-900 whitespace-pre-line text-base overflow-y-auto font-[Jameel Noori Nastaleeq,serif] pl-4 pr-2 pb-4" style={{ maxHeight: 200, fontFamily: 'Jameel Noori Nastaleeq,serif' }}>{aiUrduSummary}</div>
                  )}
                  <div className="flex gap-2 mt-4 pl-4">
                    <Button type="button" size="sm" className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300" onClick={() => aiUrduSummary && navigator.clipboard.writeText(aiUrduSummary)} disabled={!aiUrduSummary}>
                      Copy
                    </Button>
                  </div>
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex gap-2 mt-2 w-full max-w-xl">
                <Button type="button" className="bg-gradient-to-r from-green-500 via-green-400 to-emerald-500 hover:from-green-600 hover:via-green-500 hover:to-emerald-600 text-white font-semibold px-4 py-2 rounded flex-1" onClick={() => setUrduSummary(translateToUrdu(summary))}>
                  Translate to Urdu (Dictionary)
                </Button>
                <Button type="button" className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 hover:from-purple-700 hover:via-fuchsia-600 hover:to-pink-600 text-white font-semibold px-4 py-2 rounded flex-1" onClick={async () => {
                  setAiUrduLoading(true);
                  setAiUrduError("");
                  setAiUrduSummary(null);
                  try {
                    const res = await fetch("/api/translate", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ text: summary }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setAiUrduSummary(data.urdu);
                    } else {
                      setAiUrduError(data.error || "Unknown error");
                    }
                  } catch {
                    setAiUrduError("Failed to translate using AI.");
                  } finally {
                    setAiUrduLoading(false);
                  }
                }} disabled={aiUrduLoading}>
                  {aiUrduLoading ? "Translating..." : "Translate to Urdu (AI)"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}