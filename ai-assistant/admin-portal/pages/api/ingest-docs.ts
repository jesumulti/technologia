import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import Cookies from "js-cookie";

export const config = {
  api: {
    bodyParser: false,
  },
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).json({ error: "Error parsing form" });
    }

    if (!files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = files.file[0];
    const fileContent = fs.readFileSync(file.filepath);

    const orgId = req.cookies.orgId; // Get orgId from cookie

    try {
      const response = await fetch("http://localhost:8000/ingest-docs", {
        method: "POST",
        headers: {
          "X-API-Key": "test-key",
          "X-Org-ID": orgId, // Pass orgId in header
        },
        body: fileContent,
      });

      const result = await response.json();
      res.status(200).json(result);
    } catch (error) {
      console.error("Error sending file to backend:", error);
      res.status(500).json({ error: "Error sending file to backend" });
    }
  });
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  req.method === "POST" ? post(req, res) : res.status(405).send({ message: "Method not allowed" });
};

export default handler;