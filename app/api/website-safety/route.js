import { NextResponse } from "next/server";
import { getGeminiResponse } from "../../../lib/gemini";

// ── Helpers ────────────────────────────────────────────────────────────────

function fallback(result = "Suspicious", score = 50, reason = "Could not reliably analyze the URL.") {
  return NextResponse.json({ result, score, reason });
}

function parseAIResponse(rawText) {
  let text = rawText.trim();
  if (text.startsWith("```json")) text = text.replace(/^```json/, "");
  else if (text.startsWith("```")) text = text.replace(/^```/, "");
  if (text.endsWith("```")) text = text.replace(/```$/, "");
  return JSON.parse(text.trim());
}

// Basic heuristic checks before calling AI
function basicChecks(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    // Must be HTTP or HTTPS
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { flagged: true, reason: "URL uses a non-standard protocol, which is unusual and suspicious." };
    }

    // Prefer HTTPS - strict rule to skip AI
    if (parsed.protocol === "http:") {
      return { 
        flagged: true, 
        score: 30, 
        reason: "Website does not use HTTPS, making it insecure for data transmission" 
      };
    }

    // Suspiciously long hostname
    if (hostname.length > 60) {
      return { flagged: true, reason: "The domain name is unusually long, which is a common trait of phishing sites." };
    }

    // Excessive subdomains (more than 4 levels)
    const parts = hostname.split(".");
    if (parts.length > 5) {
      return { flagged: true, reason: "The URL has an unusual number of subdomains, which is a common phishing pattern." };
    }

    // IP address as hostname (suspicious)
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(hostname)) {
      return { flagged: true, reason: "The URL uses an IP address instead of a domain name, which is often used by malicious sites." };
    }

    // Known suspicious TLDs
    const suspiciousTLDs = [".xyz", ".tk", ".ml", ".ga", ".cf", ".gq", ".click", ".loan", ".work", ".top"];
    if (suspiciousTLDs.some((tld) => hostname.endsWith(tld))) {
      return { flagged: false, warning: `The domain uses a TLD (${hostname.split(".").pop()}) commonly associated with spam or low-trust sites.` };
    }

    return { flagged: false };
  } catch {
    return { flagged: true, reason: "The URL could not be parsed. Please enter a valid URL." };
  }
}

// ── Route ──────────────────────────────────────────────────────────────────

export async function POST(req) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string" || !url.trim()) {
      return fallback("Suspicious", 0, "No URL was provided.");
    }

    const trimmedUrl = url.trim();

    // Step 1 — run basic heuristic checks
    const check = basicChecks(trimmedUrl);
    if (check.flagged) {
      return NextResponse.json({
        result: "Suspicious",
        score: check.score || 10,
        reason: check.reason,
      });
    }

    // Step 2 — AI analysis
    const warningNote = check.warning ? `\nNote from pre-check: ${check.warning}` : "";

    const prompt = `
You are a cybersecurity expert specializing in identifying phishing sites, scam websites, and malicious URLs.

Analyze the following URL and determine whether it is safe or suspicious.
${warningNote}

URL: ${trimmedUrl}

Consider:
1. Domain structure and naming patterns (e.g., brand impersonation, misspellings like "paypa1.com")
2. Use of subdomains to spoof legitimate brands (e.g., "google.com.login-now.xyz")
3. Known scam/phishing TLDs or hosting patterns
4. Trustworthiness and legitimacy of the domain
5. Common patterns used in phishing and scam campaigns

You must respond ONLY with a raw JSON object and no other text, markdown, or code blocks.
The JSON must match exactly:
{
  "result": "Safe" | "Suspicious",
  "score": <integer 0-100 representing safety, where 100 = fully safe, 0 = definitely malicious>,
  "reason": "<concise one or two sentence explanation>"
}
`;

    const aiResponse = await getGeminiResponse(prompt);
    const parsed = parseAIResponse(aiResponse);

    return NextResponse.json({
      result: parsed.result === "Safe" ? "Safe" : "Suspicious",
      score: typeof parsed.score === "number" ? Math.min(100, Math.max(0, parsed.score)) : 50,
      reason: parsed.reason || "No explanation provided.",
    });

  } catch (error) {
    console.error("API Error - Website Safety Route:", error);

    if (error?.status === 429) {
      return fallback("Suspicious", 50, "Rate limit reached. Please try again shortly.");
    }
    if (error instanceof SyntaxError) {
      return fallback("Suspicious", 50, "Could not parse AI response.");
    }

    return fallback("Suspicious", 50, "Could not analyze the URL due to a server error.");
  }
}
