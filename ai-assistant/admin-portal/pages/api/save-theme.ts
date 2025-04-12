// pages/api/save-theme.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'js-cookie';

/**
 * Interface for the theme data that will be sent to the backend.
 */
interface Theme {
  mainColor: string;
}

/**
 * API route handler for saving the theme for the current organization.
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is POST.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract the theme data from the request body.
  const { mainColor } = req.body as Theme;

  // Check if the mainColor is present.
  if (!mainColor) {
    return res.status(400).json({ error: 'Missing mainColor in request body' });
  }

  // Retrieve the organization ID and token from the cookies.
  const orgId = Cookies.get('orgId');
  const token = Cookies.get('token');

  // Check if the organization ID is present.
  if (!orgId) {
    return res.status(400).json({ error: 'Missing orgId cookie' });
  }

  // Check if the token is present.
  if (!token) {
    return res.status(400).json({ error: 'Missing token cookie' });
  }

  try {
    // Send a request to the backend to save the theme.
    const response = await fetch('http://localhost:8000/save-theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': token, // Include the API key in the header.
      },
      body: JSON.stringify({ mainColor }), // Send the theme data in the request body.
    });

    // Check if the request was successful.
    if (response.ok) {
      return res.status(200).json({ message: 'Theme saved successfully' });
    } else {
      // If the request was not successful, return an error message.
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.error || 'Failed to save theme' });
    }
  } catch (error: any) {
    // If an error occurred during the request, return an error message.
    return res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
}