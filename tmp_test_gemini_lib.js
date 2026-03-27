require('dotenv').config();
const { getGeminiResponse } = require('./lib/gemini');

async function test() {
  try {
    const text = 'NASA just confirmed that the Moon is actually made of green cheese and they have been hiding it since the Apollo missions.';
    const prompt = `Analyze this: ${text}`;
    const result = await getGeminiResponse(prompt);
    console.log('RESULT:', result);
  } catch (e) {
    console.error('ERROR:', e);
  }
}
test();
