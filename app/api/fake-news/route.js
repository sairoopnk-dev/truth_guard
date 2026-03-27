import { NextResponse } from "next/server";
import { getGeminiResponse } from "../../../lib/gemini";

export async function POST(req) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== "string" || content.trim().length < 15) {
      console.log("Safety layer triggered: Input too short or unclear.");
      return NextResponse.json({
        result: "Uncertain",
        confidence: 50,
        reason: "Uncertain – insufficient information"
      });
    }
    const currentDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // We ask Gemini to respond purely in JSON format.
    const prompt = `
Current Date and Time: ${currentDate}

You are an expert fact-checker and journalist. Analyze the following text and determine if it is fake news or misinformation.

IMPORTANT:
1. Be conservative in your judgment. Do NOT label as fake without strong evidence.
2. Prefer "Uncertain" if you are unsure or lack evidence.
3. Consider real-world plausibility.
4. Compare against patterns from trusted sources (e.g., BBC News, Reuters, The Hindu, NDTV).
5. If no reliable confirmation exists, mark "Uncertain" (NOT Fake).
6. Compare any dates mentioned in the text with the 'Current Date and Time' above.
7. If the text mentions events as having happened but they are in the future relative to the current date, mark them as "Likely Fake" or "Uncertain".
8. Evaluate past events normally based on current known facts.
9. You must respond ONLY with a raw JSON object and no other text, markdown, or code blocks.

The JSON object must strictly match the following structure:
{
  "result": "Real" | "Likely Fake" | "Uncertain",
  "confidence": <integer from 0 to 100>,
  "reason": "<short explanation>",
  "verification_summary": "<brief verification breakdown>"
}

Text to analyze:
"""
${content}
"""
`;

    const aiResponse = await getGeminiResponse(prompt);
    let responseText = aiResponse.trim();

    // Clean up potential markdown formatting if Gemini still included it
    if (responseText.startsWith("```json")) {
      responseText = responseText.replace(/^```json/, "");
    } else if (responseText.startsWith("```")) {
      responseText = responseText.replace(/^```/, "");
    }
    if (responseText.endsWith("```")) {
      responseText = responseText.replace(/```$/, "");
    }

    try {
      const parsedData = JSON.parse(responseText.trim());

      // Return the structured payload
      return NextResponse.json({
        result: parsedData.result || "Uncertain",
        confidence: parsedData.confidence >= 0 ? parsedData.confidence : 0,
        reason: parsedData.reason || "No explanation provided.",
      });
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", responseText, parseError);
      console.log("Fallback used: Parse error.");
      return NextResponse.json({
        result: "Uncertain",
        confidence: 50,
        reason: "Could not reliably analyze the news."
      });
    }
  } catch (error) {
    console.error("API Error - Fake News Route:", error);
    
    // Handle specific Rate Limit API error
    if (error?.status === 429) {
      console.log("Fallback used: Rate limit.");
      return NextResponse.json({
        result: "Uncertain",
        confidence: 50,
        reason: "Rate limit reached. Please try again shortly."
      });
    }

    console.log("Fallback used: General error.");
    return NextResponse.json({
      result: "Uncertain",
      confidence: 50,
      reason: "Could not reliably analyze the news due to a server error."
    });
  }
}
