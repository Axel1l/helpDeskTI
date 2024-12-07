import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { ticketId } = params;

  // Validar que ticketId sea un número entero válido
  if (isNaN(ticketId) || ticketId <= 0) {
    return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: {
        id: parseInt(ticketId),
      },
      include: {
        creator: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error retrieving ticket' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { ticketId } = params;

  // Validar que ticketId sea un número entero válido
  if (isNaN(ticketId) || ticketId <= 0) {
    return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
  }

  try {
    const { title, description, category, priority, status, assigneeId } = await req.json();

    // Validar que los campos obligatorios estén presentes
    if (!title || !description || !category || !priority || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedTicket = await prisma.ticket.update({
      where: {
        id: parseInt(ticketId),
      },
      data: {
        title,
        description,
        category,
        priority,
        status,
        assignee: assigneeId ? { connect: { id: assigneeId } } : undefined,
      },
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating ticket' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { ticketId } = params;

  // Validar que ticketId sea un número entero válido
  if (isNaN(ticketId) || ticketId <= 0) {
    return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
  }

  try {
    const deletedTicket = await prisma.ticket.delete({
      where: {
        id: parseInt(ticketId),
      },
    });

    return NextResponse.json(deletedTicket);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error deleting ticket' }, { status: 500 });
  }
}
