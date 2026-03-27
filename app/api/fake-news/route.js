import { NextResponse } from "next/server";
import { getGeminiResponse } from "../../../lib/gemini";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

// Shared JSON schema instruction appended to every prompt
function jsonSchema() {
  return `
You must respond ONLY with a raw JSON object and no other text, markdown, or code blocks.
The JSON object must strictly match the following structure:
{
  "result": "Real" | "Likely Fake" | "Uncertain",
  "confidence": <integer from 0 to 100>,
  "reason": "<short explanation>",
  "verification_summary": "<brief verification breakdown>"
}`;
}

function buildBasePromptPrefix(currentDate) {
  return `Current Date and Time: ${currentDate}

You are an expert fact-checker and journalist.

IMPORTANT:
1. Be conservative in your judgment. Do NOT label as fake without strong evidence.
2. Prefer "Uncertain" if you are unsure or lack evidence.
3. Consider real-world plausibility.
4. Compare against patterns from trusted sources (e.g., BBC News, Reuters, The Hindu, NDTV).
5. If no reliable confirmation exists, mark "Uncertain" (NOT Fake).
6. Compare any dates mentioned in the content with the 'Current Date and Time' above.
7. If the content mentions events as having happened but they are in the future relative to the current date, mark them as "Likely Fake" or "Uncertain".
8. Evaluate past events normally based on current known facts.`;
}

function getCurrentDate() {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function parseAIResponse(rawText) {
  let responseText = rawText.trim();
  if (responseText.startsWith("```json")) {
    responseText = responseText.replace(/^```json/, "");
  } else if (responseText.startsWith("```")) {
    responseText = responseText.replace(/^```/, "");
  }
  if (responseText.endsWith("```")) {
    responseText = responseText.replace(/```$/, "");
  }
  return JSON.parse(responseText.trim());
}

function fallbackResponse(reason = "Could not reliably analyze the content.") {
  return NextResponse.json({ result: "Uncertain", confidence: 50, reason });
}

// Call Gemini directly for image (multimodal) – gemini.js only supports text
async function getGeminiImageResponse(prompt, base64Image, mimeType, isRetry = false) {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not defined in .env");

  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType || "image/jpeg",
              data: base64Image,
            },
          },
        ],
      },
    ],
    generationConfig: { temperature: 0.2 },
  };

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 429 && !isRetry) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return getGeminiImageResponse(prompt, base64Image, mimeType, true);
    }
    const errorText = await response.text();
    console.error(`Gemini API Image Error (${response.status}):`, errorText);
    const error = new Error(`Gemini API failed: ${response.status} ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!generatedText) throw new Error("Could not extract text from Gemini image response.");
  return generatedText;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, content, image, mimeType } = body;
    const currentDate = getCurrentDate();

    // ── TEXT ─────────────────────────────────────────────────────────────────
    if (!type || type === "text") {
      if (!content || typeof content !== "string" || content.trim().length < 15) {
        return fallbackResponse("Insufficient information provided.");
      }

      const prompt = `
${buildBasePromptPrefix(currentDate)}

Analyze the following text and determine if it is fake news or misinformation.
${jsonSchema()}

Text to analyze:
"""
${content}
"""
`;
      const aiResponse = await getGeminiResponse(prompt);
      const parsed = parseAIResponse(aiResponse);
      return NextResponse.json({
        result: parsed.result || "Uncertain",
        confidence: parsed.confidence >= 0 ? parsed.confidence : 0,
        reason: parsed.reason || "No explanation provided.",
      });
    }


    // ── IMAGE ─────────────────────────────────────────────────────────────────
    if (type === "image") {
      if (!image || typeof image !== "string") {
        return fallbackResponse("No image data received.");
      }

      const prompt = `
${buildBasePromptPrefix(currentDate)}

Analyze the news content visible in this image. Read any text, headlines, or captions in the image and determine if the information shown is fake news or misinformation.
${jsonSchema()}
`;
      const aiResponse = await getGeminiImageResponse(prompt, image, mimeType);
      const parsed = parseAIResponse(aiResponse);
      return NextResponse.json({
        result: parsed.result || "Uncertain",
        confidence: parsed.confidence >= 0 ? parsed.confidence : 0,
        reason: parsed.reason || "No explanation provided.",
      });
    }

    return fallbackResponse("Unknown input type.");

  } catch (error) {
    console.error("API Error - Fake News Route:", error);

    if (error?.status === 429) {
      return fallbackResponse("Rate limit reached. Please try again shortly.");
    }

    // Surface JSON parse errors separately
    if (error instanceof SyntaxError) {
      console.error("JSON parse error from Gemini response");
      return fallbackResponse("Could not parse AI response.");
    }

    return fallbackResponse("Could not reliably analyze the content due to a server error.");
  }
}
