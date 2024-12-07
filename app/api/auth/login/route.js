import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sign } from "jsonwebtoken";

export async function POST(req) {
  if (!process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ message: "Error de configuración del servidor" }, { status: 500 });
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email y contraseña son requeridos" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Contraseña incorrecta" }, { status: 401 });
    }

    // Crear token JWT
    const token = sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: "30d" }
    );

    // Configurar cookie segura con el token
    const response = NextResponse.json(
      {
        message: "Login exitoso",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // if (user.role === "AGENT") {
    //   response.headers.set("Location", "/dashboard/AGENT");
    // } else if (user.role === "USER") {
    //   response.headers.set("Location", "/dashboard/USER");
    // }

    // Configurar cookie
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 días
    });

    return response;
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
