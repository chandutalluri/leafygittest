import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Forward the request to the backend auth service
    const response = await fetch('http://127.0.0.1:8085/api/auth/me', {
      headers: {
        Authorization: req.headers.authorization || '',
        Cookie: req.headers.cookie || '',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      res.status(200).json(userData);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
