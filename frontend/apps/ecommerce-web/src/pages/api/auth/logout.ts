import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Forward the request to the backend auth service through gateway
    const response = await fetch('http://127.0.0.1:5000/api/auth/logout', {
      method: 'POST',
      headers: {
        Cookie: req.headers.cookie || '',
      },
    });

    if (response.ok) {
      // Clear authentication cookies
      res.setHeader('Set-Cookie', [
        'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
        'refresh-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
      ]);
      res.status(200).json({ message: 'Logged out successfully' });
    } else {
      res.status(response.status).json({ message: 'Logout failed' });
    }
  } catch (error) {
    console.error('Logout failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
