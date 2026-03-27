"use client";

/**
 * FileUpload — placeholder UI component.
 * Will handle file selection once feature logic is implemented.
 *
 * Props (future):
 *   - onFileSelect : (File) => void
 *   - accept       : string — MIME types e.g. "image/*,.pdf"
 *   - label        : string
 */
export default function FileUpload({ onFileSelect, accept = "*", label = "Upload a file" }) {
  return (
    <div
      id="file-upload"
      className="glass flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors hover:border-indigo-500"
      style={{ borderColor: "var(--border)" }}
    >
      <span className="mb-3 text-5xl">📂</span>
      <p className="mb-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        {label}
      </p>
      <p className="mb-4 text-xs" style={{ color: "var(--text-muted)" }}>
        Drag & drop or click to browse
      </p>

      <label
        htmlFor="file-input"
        className="btn-glow cursor-pointer rounded-xl px-6 py-2 text-sm font-semibold text-white"
      >
        Choose File
      </label>
      <input
        id="file-input"
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          if (onFileSelect && e.target.files?.[0]) {
            onFileSelect(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
