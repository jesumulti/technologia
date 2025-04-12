import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Get the orgId from the cookie
      const orgId = req.cookies.orgId;

      if (!orgId) {
        return res.status(400).json({ message: 'orgId not found in cookie' });
      }

      const response = await fetch('http://localhost:8000/list-files', {
        method: 'GET',
        headers: {
          'X-API-Key': orgId, // Assuming orgId is used as the tenantId
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.statusText}`);
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ message: 'Error fetching files', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}