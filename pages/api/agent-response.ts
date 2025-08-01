import { NextApiRequest, NextApiResponse } from 'next';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGeminiAPI(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    return getFallbackResponse();
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 80, temperature: 0.8 }
        })
      }
    );

    const data = await response.json();
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }
    throw new Error('Invalid response');
  } catch (error) {
    console.error('Gemini API error:', error);
    return getFallbackResponse();
  }
}

function getFallbackResponse(): string {
  const responses = [
    "Namaste uncle ji! Main PM-KUSUM scheme ke baare mein call kar rahi thi. Government subsidy milti hai solar pump ke liye. Sunna chahenge?",
    "Bhaiya, solar pump se bijli ka bill kam ho jata hai. 90% subsidy government deti hai. Interest hai?",
    "Dekho ji, diesel pump ki jagah solar pump lagwa sakte hain. Paisa bachega aur environment bhi safe rahega."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, isOpening = false } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }

  try {
    let agentResponse: string;

    if (isOpening) {
      const prompt = `You are a friendly female agent calling Indian farmer about PM-KUSUM solar scheme. Create natural Hinglish opening (30-40 words): warm tone, mention government subsidy, ask if interested. Mix Hindi-English naturally.`;
      agentResponse = await callGeminiAPI(prompt);
    } else {
      const prompt = `Farmer said: "${message}". Respond as female agent in Hinglish (25-35 words): explain PM-KUSUM benefits, 90% government subsidy, solar pump advantages. Sound caring and helpful.`;
      agentResponse = await callGeminiAPI(prompt);
    }

    res.status(200).json({ response: agentResponse });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
