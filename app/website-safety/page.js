"use client";

import { useState } from "react";
import ResultCard from "../../components/ResultCard";

export default function WebsiteSafetyPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch("/api/website-safety", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) throw new Error("Failed to check URL. Please try again.");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCheck();
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className="text-4xl font-extrabold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Website Safety Checker
        </h1>
        <p className="text-lg" style={{ color: "var(--text-muted)" }}>
          Enter a URL to check whether it is safe or suspicious.
        </p>
      </div>

      {/* Input Panel */}
      <div className="glass rounded-2xl p-6 mb-8">
        <div className="flex gap-3">
          <input
            id="url-input"
            type="url"
            className="flex-1 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            style={{
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
            placeholder="Enter website URL... e.g. https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            id="check-safety-btn"
            onClick={handleCheck}
            disabled={loading || !url.trim()}
            className="btn-glow px-6 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
          >
            {loading ? "Checking..." : "Check Safety"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ResultCard
            title="Safety Check Result"
            verdict={result.result}
            score={result.score}
            details={result.reason}
          />
        </div>
      )}
    </div>
  );
}
