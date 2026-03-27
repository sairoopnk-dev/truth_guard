import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "Valid content is required." },
        { status: 400 }
      );
    }

    const model = getGeminiModel("gemini-1.5-flash");

    // We ask Gemini to respond purely in JSON format.
    const prompt = `
You are an expert fact-checker and journalist. Analyze the following text and determine if it is fake news or misinformation.

IMPORTANT: You must respond ONLY with a raw JSON object and no other text, markdown, or code blocks.
The JSON object must strictly match the following structure:
{
  "result": "Real" | "Likely Fake" | "Uncertain",
  "confidence": <integer from 0 to 100>,
  "reason": "<short explanation, maximum 2 sentences>"
}

Text to analyze:
"""
${content}
"""
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();

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
      return NextResponse.json(
        { error: "Model returned invalid format." },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("API Error - Fake News Route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
