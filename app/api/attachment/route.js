import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { filePath, ticketId } = req.body;
      const newAttachment = await prisma.attachment.create({
        data: {
          filePath,
          ticketId,
        },
      });
      res.status(201).json(newAttachment);
    } catch (error) {
      res.status(500).json({ error: 'Error uploading attachment' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
