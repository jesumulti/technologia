import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'js-cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const permissions = req.body;
    const orgId = req.cookies.orgId;

    if (!orgId) {
      return res.status(400).json({ error: 'orgId cookie is missing' });
    }

    try {
      const response = await fetch(`http://localhost:8000/save-permissions`, {
        method: 'POST',
        headers: {
          'X-API-Key': 'test-key', // Replace with actual API key logic
          'Content-Type': 'application/json',
          'X-API-Key': 'test-key',
        },
        body: JSON.stringify(permissions),
      });

      if (response.ok) {
        const data = await response.json();
        res.status(200).json(data);
      } else {
        const errorData = await response.json()
        res.status(response.status).json(errorData);
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while saving permissions' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}