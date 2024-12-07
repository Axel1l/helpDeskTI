import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';  
import bcrypt from 'bcryptjs'; 
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(2), // Validación para username
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['USER', 'AGENT']), // Asegúrate de que estos son los roles permitidos
});

// GET /api/users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        tickets: true,   
        assignedTickets: true,  
        comments: true,  
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request) {
  try {
    const data = await request.json();
    const validatedData = userSchema.parse(data); 

    const existingUserEmail = await prisma.user.findUnique ({
      where: { email: validatedData.email },
    });

    const existingUsername = await prisma.user.findUnique({
      where: { username: validatedData.username },
    });

    if (existingUserEmail) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 409 } 
      );
    }

    if (existingUsername) {
      return NextResponse.json(
        { error: "El nombre de usuario ya está en uso" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser  = await prisma.user.create({
      data: {
        name: validatedData.name,
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,  
        role: validatedData.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(newUser , { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 }
    );
  }
}