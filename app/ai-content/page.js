"use client";

import { useState, useRef } from "react";
import ResultCard from "../../components/ResultCard";

const ACCEPTED_TYPES = ".pdf,.doc,.docx,.txt,image/*";

export default function AIContentPage() {
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // base64 data URL for images
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const isImage = file && file.type.startsWith("image/");
  const hasText = textInput.trim().length > 0;
  const hasFile = file !== null;
  const canSubmit = !loading && (hasText || hasFile);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setResult(null);
    setError("");

    if (selected.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (!dropped) return;
    setFile(dropped);
    setResult(null);
    setError("");
    if (dropped.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(dropped);
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const body = {};

      if (hasText) body.text = textInput.trim();

      if (hasFile) {
        // Read file as base64
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        body.file = base64;
        body.fileName = file.name;
        body.mimeType = file.type || "application/octet-stream";
      }

      const response = await fetch("/api/ai-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to analyze content. Please try again.");

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
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-4" style={{ color: "var(--text-primary)" }}>
          AI Content Detector
        </h1>
        <p className="text-lg" style={{ color: "var(--text-muted)" }}>
          Paste text or upload a file to detect whether it was written by AI or a human.
        </p>
      </div>

      {/* Input Panel */}
      <div className="glass rounded-2xl p-6 mb-8">
        {/* Textarea */}
        <textarea
          id="text-input"
          className="w-full h-36 p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 text-sm"
          style={{
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
          placeholder="Paste text here to analyze... (optional)"
          value={textInput}
          onChange={(e) => { setTextInput(e.target.value); setResult(null); }}
          disabled={loading}
        />

        {/* File Upload Zone */}
        {!hasFile ? (
          <div
            id="file-drop-zone"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 mb-4"
            style={{
              border: "2px dashed var(--border)",
              minHeight: "90px",
              background: "var(--bg-primary)",
            }}
          >
            <div className="text-center py-4">
              <span className="text-2xl">📎</span>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Click or drag &amp; drop a file (optional)
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                PDF, DOC, DOCX, TXT, or Image
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {isImage && filePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={filePreview}
                alt="Selected"
                className="w-full max-h-48 object-contain"
                style={{ background: "var(--bg-primary)" }}
              />
            ) : (
              <div
                className="flex items-center gap-3 px-4 py-4"
                style={{ background: "var(--bg-primary)" }}
              >
                <span className="text-2xl">📄</span>
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {file.name}
                </span>
              </div>
            )}
            <div
              className="flex items-center justify-between px-4 py-2 text-xs"
              style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}
            >
              <span>📎 {file.name}</span>
              <button
                onClick={removeFile}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileRef}
          id="file-upload"
          type="file"
          accept={ACCEPTED_TYPES}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Hint */}
        {(hasText || hasFile) && (
          <p className="text-xs mb-4 text-center" style={{ color: "var(--text-muted)" }}>
            {hasText && hasFile
              ? "Analyzing text + file together"
              : hasFile
              ? `Analyzing file: ${file.name}`
              : "Analyzing text content"}
          </p>
        )}

        {/* Submit */}
        <button
          id="analyze-btn"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full btn-glow rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Analyzing..." : "Analyze Content"}
        </button>
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
            title="AI Detection Result"
            verdict={result.result}
            score={result.confidence}
            details={result.reason}
          />
        </div>
      )}
    </div>
  );
}
