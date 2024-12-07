'use client'
import Link from 'next/link'
import { Home, Ticket, BarChart2, Settings, LogOut, SquareUserRound } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
export default function Sidebar() {
  const { logout } = useAuth(); // Obtener la función de logout
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedUser  = localStorage.getItem('user'); // Obtener el usuario de localStorage
    if (storedUser ) {
      const user = JSON.parse(storedUser ); // Parsear el JSON
      setRole(user.role); // Establecer el rol en el estado
    }
  }, []);
  const handleLogout = async () => {
    try {
      await logout(); // Llamar a la función de logout
      window.location.href = '/auth/login'; // Redirigir a la página de login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <aside className="bg-zinc-900 w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {role === 'AGENT' ? (
          <>
            {/* Opciones para el rol de AGENT */}
            <Link
          href="/dashboard"
          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-zinc-800 rounded-lg"
        >
          <Home className="h-5 w-5" />
          <span>Inicio</span>
        </Link>
        <Link
          href="/dashboard/tickets"
          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-zinc-800 rounded-lg"
        >
          <Ticket className="h-5 w-5" />
          <span>Tickets</span>
        </Link>
        <Link
          href="/dashboard/analytics"
          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-zinc-800 rounded-lg"
        >
          <BarChart2 className="h-5 w-5" />
          <span>Analíticas</span>
        </Link>
        <Link
          href="/dashboard/register"
          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-zinc-800 rounded-lg"
        >
          <SquareUserRound className="h-5 w-5" />
          <span>Crear Usuario</span>
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-zinc-800 rounded-lg"
        >
          <Settings className="h-5 w-5" />
          <span>Configuración</span>
        </Link>
        <div className="pt-4 mt-4 border-t border-zinc-800">
        <button
          onClick={handleLogout} // Llamar a la función handleLogout al hacer clic
          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-zinc-800 rounded-lg w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </button>
            </div>
          </>
        ) : role === 'USER' ? (
          <>
            {/* Opciones para el rol de USER */}
            <Link
              href="/dashboard/tickets"
              className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-zinc-800 rounded-lg"
            >
              <Ticket className="h-5 w-5" />
              <span>Tickets</span>
            </Link>
            <div className="pt-4 mt-4 border-t border-zinc-800">
        <button
          onClick={handleLogout} // Llamar a la función handleLogout al hacer clic
          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-zinc-800 rounded-lg w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </button>
            </div>
          </>
        ) : (
          // Opciones para otros roles o para un usuario no autenticado
          <div className="pt-4 mt-4 border-t border-zinc-800">
        <button
          onClick={handleLogout} // Llamar a la función handleLogout al hacer clic
          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-zinc-800 rounded-lg w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </button>
            </div>
        )}
      </nav>
    </aside>
  )
}