"use client";

import { useState, useRef } from "react";
import ResultCard from "../../components/ResultCard";

const INPUT_TYPES = [
  { id: "text", label: "Text", icon: "📝" },
  { id: "image", label: "Image", icon: "🖼️" },
];

export default function FakeNewsPage() {
  const [inputType, setInputType] = useState("text");
  const [textInput, setTextInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const switchType = (type) => {
    setInputType(type);
    setResult(null);
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const isSubmitDisabled = () => {
    if (loading) return true;
    if (inputType === "text") return !textInput.trim();
    if (inputType === "image") return !imageFile;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setError("");

    try {
      let body = { type: inputType };

      if (inputType === "text") {
        body.content = textInput;
      } else if (inputType === "image") {
        // Convert to base64 — strip the data:image/...;base64, prefix
        const base64 = imagePreview.split(",")[1];
        const mimeType = imageFile.type || "image/jpeg";
        body.image = base64;
        body.mimeType = mimeType;
      }

      const response = await fetch("/api/fake-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze. Please try again.");
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
      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className="text-4xl font-extrabold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Fake News Detector
        </h1>
        <p className="text-lg" style={{ color: "var(--text-muted)" }}>
          Analyze news credibility using text or an image.
        </p>
      </div>

      {/* Input Type Tabs */}
      <div className="flex gap-3 mb-6 justify-center">
        {INPUT_TYPES.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            onClick={() => switchType(t.id)}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background:
                inputType === t.id
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "var(--bg-card)",
              color:
                inputType === t.id ? "#fff" : "var(--text-muted)",
              border: "1px solid var(--border)",
              boxShadow:
                inputType === t.id
                  ? "0 0 16px rgba(99,102,241,0.4)"
                  : "none",
            }}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Input Panel */}
      <div className="glass rounded-2xl p-6 mb-8">

        {/* TEXT */}
        {inputType === "text" && (
          <textarea
            id="text-input"
            className="w-full h-48 p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
            style={{
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
            placeholder="Paste a news article or headline here..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
        )}


        {/* IMAGE */}
        {inputType === "image" && (
          <div className="mb-6">
            <div
              id="image-drop-zone"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
              style={{
                border: "2px dashed var(--border)",
                minHeight: "180px",
                background: "var(--bg-primary)",
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith("image/")) {
                  setImageFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => setImagePreview(reader.result);
                  reader.readAsDataURL(file);
                }
              }}
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="max-h-64 rounded-lg object-contain"
                />
              ) : (
                <div className="text-center p-6">
                  <div className="text-4xl mb-3">🖼️</div>
                  <p style={{ color: "var(--text-muted)" }} className="text-sm">
                    Click or drag & drop an image here
                  </p>
                  <p style={{ color: "var(--text-muted)" }} className="text-xs mt-1">
                    PNG, JPG, WEBP supported
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {imageFile && (
              <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                Selected: {imageFile.name}
                <button
                  className="ml-3 text-red-400 hover:text-red-300"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                >
                  Remove
                </button>
              </p>
            )}
          </div>
        )}

        {/* Analyze Button */}
        <button
          id="analyze-btn"
          onClick={handleSubmit}
          disabled={isSubmitDisabled()}
          className="w-full btn-glow rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Analyzing..." : `Analyze ${INPUT_TYPES.find(t => t.id === inputType)?.label}`}
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
