import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';


// Función para manejar el método GET
export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        creator: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: 'Error retrieving tickets', details: error.message }, { status: 500 });
  }
}

// Función para manejar el método POST
export async function POST(req) {
  try {
    const { title, description, category, priority, status, userId, assignedId } = await req.json();

    if (!title || !description || !category || !priority || !status || !userId) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        category,
        priority,
        status,
        creator: { connect: { id: userId } },
        assignee: { connect: { id: assignedId } },
      },
    });

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Error en el formato de los datos JSON.' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Error al crear el ticket', details: error.message }, { status: 500 });
  }
}
