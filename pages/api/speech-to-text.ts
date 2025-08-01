import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Placeholder for speech recognition
  // In production, integrate with Google Cloud Speech-to-Text or similar
  res.status(200).json({ 
    error: 'Server-side speech recognition not implemented. Using Web Speech API in browser.' 
  });
}
