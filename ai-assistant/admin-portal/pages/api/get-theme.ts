// /ai-assistant/admin-portal/pages/api/get-theme.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'js-cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the orgId from the cookie
    const orgId = Cookies.get('orgId');
    if (!orgId) {
      return res.status(400).json({ error: 'orgId cookie is missing' });
    }

    // Get the token from the cookie
    const token = Cookies.get('token');
    if (!token) {
      return res.status(400).json({ error: 'token cookie is missing' });
    }

    // Call to the backend to get the theme
    const backendResponse = await fetch(`http://localhost:8000/get-theme`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': orgId,
      },
    });

    // Check if the response is ok
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json({ error: errorData.detail || 'Failed to get theme from backend' });
    }

    // Parse the response data
    const data = await backendResponse.json();

    // Return the data to the client
    res.status(200).json(data);
  } catch (error) {
    // Handle any errors
    console.error('Error getting theme:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}