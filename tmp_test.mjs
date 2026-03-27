import { getGeminiResponse } from './lib/gemini.js';
try {
  const res = await getGeminiResponse('Respond with "Working" if you are receiving this.');
  console.log('API RESPONSE:', res);
} catch (e) {
  console.error('API ERROR:', e);
}
