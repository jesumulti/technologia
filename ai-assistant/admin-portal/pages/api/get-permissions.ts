import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'js-cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const orgId = req.cookies.orgId;

    if (!orgId) {
      return res.status(400).json({ error: 'orgId not found in cookies' });
    }

    try {
      const response = await fetch(`http://localhost:8000/get-permissions?org_id=${orgId}`, {
        headers: {
          'x-api-key': 'test-key', // Replace with your actual API key
        },
      });

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching permissions' });
    }
  }

  return res.status(405).end(); // Method Not Allowed
}