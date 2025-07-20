import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Build query string from request query parameters
    const queryParams = new URLSearchParams(req.query as any).toString();
    const url = `http://127.0.0.1:5000/api/direct-data/categories${queryParams ? `?${queryParams}` : ''}`;
    
    // Forward the request to the backend service through gateway
    const response = await fetch(url, {
      headers: {
        Authorization: req.headers.authorization || '',
      },
    });

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      const errorData = await response.text();
      console.error('Categories API error:', response.status, errorData);
      res.status(response.status).json({ 
        error: 'Failed to fetch categories',
        details: errorData 
      });
    }
  } catch (error) {
    console.error('Categories API failed:', error);
    res.status(502).json({ 
      error: 'Service temporarily unavailable',
      message: 'The requested service is starting up. Please try again in a moment.',
      retry: true
    });
  }
}