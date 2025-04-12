// api/get-escalations.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'js-cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the orgId from the cookie
    const orgId = Cookies.get('orgId');
    if (!orgId) {
      return res.status(400).json({ message: 'orgId cookie is missing' });
    }

    // Get the token from the cookie
    const token = Cookies.get('token');
    if (!token) {
        return res.status(401).json({ message: "Missing authentication token" });
    }

    // Make a request to the backend API to get the escalations
    const response = await fetch(`/get-escalations`, {
      method: 'GET',
      headers: {
        'X-API-Key': orgId, // Use the orgId as the API key
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ message: errorData.message || 'Failed to fetch escalations' });
    }

    // Parse the response data
    const data = await response.json();

    // Return the escalations data to the client
    res.status(200).json(data);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching escalations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}