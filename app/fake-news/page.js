"use client";

import { useState } from "react";
import ResultCard from "../../components/ResultCard";

export default function FakeNewsPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch("/api/fake-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze the text. Please try again.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-4" style={{ color: "var(--text-primary)" }}>
          Fake News Detector
        </h1>
        <p className="text-lg" style={{ color: "var(--text-muted)" }}>
          Paste any article or headline below and let our AI analyze its credibility.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 mb-8">
        <textarea
          className="w-full h-48 p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
          style={{
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
          placeholder="Paste news here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        
        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="w-full btn-glow rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Analyzing..." : "Analyze Text"}
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ResultCard
            title="Analysis Result"
            verdict={result.result}
            score={result.confidence}
            details={result.reason}
          />
        </div>
      )}
    </div>
  );
}
