import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Forward the request to the backend auth service
    const response = await fetch('http://127.0.0.1:8085/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const result = await response.json();

    if (response.ok) {
      // Set authentication cookies
      res.setHeader('Set-Cookie', response.headers.get('set-cookie') || '');
      res.status(201).json(result);
    } else {
      res.status(response.status).json(result);
    }
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
