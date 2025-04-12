import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface Org {
  id: string;
  name: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    try {
      const orgsFilePath = path.join(process.cwd(), 'ai-assistant/admin-portal/data', 'orgs.json');
      let orgs: Org[] = [];

      if (fs.existsSync(orgsFilePath)) {
        const fileData = fs.readFileSync(orgsFilePath, 'utf-8');
        orgs = JSON.parse(fileData);
      }

      const newOrg: Org = {
        id: Date.now().toString(),
        name,
      };

      orgs.push(newOrg);
      fs.writeFileSync(orgsFilePath, JSON.stringify(orgs, null, 2));

      res.status(201).json(newOrg);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while creating the organization' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}