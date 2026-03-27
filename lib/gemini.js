export async function getGeminiResponse(text, isRetry = false) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in .env");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: text }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2
        }
      }),
    });

    if (!response.ok) {
      if (response.status === 429 && !isRetry) {
        console.warn("Gemini API Rate limit reached. Retrying in 2 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return getGeminiResponse(text, true);
      }

      const errorText = await response.text();
      console.error(`Gemini API Error (${response.status}):`, errorText);
      const error = new Error(`Gemini API failed: ${response.status} ${response.statusText}`);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    console.log("Gemini API Response:", JSON.stringify(data, null, 2));
    
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      console.error("Unexpected API response structure:", JSON.stringify(data, null, 2));
      throw new Error("Could not extract text from Gemini response.");
    }

    return generatedText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
