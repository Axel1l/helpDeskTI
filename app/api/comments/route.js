import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { content, authorId, ticketId } = req.body;
      const newComment = await prisma.comment.create({
        data: {
          content,
          authorId,
          ticketId,
        },
      });
      return NextResponse.json(newComment);
    } catch (error) {
      return NextResponse.json({ error: 'Error creating comment' });
    }
  }
}
