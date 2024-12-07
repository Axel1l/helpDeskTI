import { NextResponse } from 'next/server';

export async function POST(req) {
  try {

    // Eliminar la cookie de autenticación
    const response = NextResponse.json({ message: 'Logout exitoso' }, { status: 200 });
    response.cookies.delete('auth-token'); // Asegúrate de eliminar la cookie

    return response;
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json({ message: 'Error al cerrar sesión' }, { status: 500 });
  }
}