'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import jwt from 'jsonwebtoken';

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='));
        if (token) {
          const tokenValue = token.split('=')[1];
          const decoded = jwt.decode(tokenValue); // Decodificar el token

          if (decoded) {
            setUser ({
              id: decoded.id,
              email: decoded.email,
              role: decoded.role, // Asegúrate de que el rol esté en el token
              name: decoded.name,
            });
          } else {
            setUser (null);
          }
        } else {
          setUser (null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser (null);
      } finally {
        setLoading(false); // Asegúrate de que el loading se establezca a false después de verificar
      }
    };
    checkAuth()
  }, [])

  // const checkAuth = async () => {
  //   try {
  //     // Verificar token almacenado y obtener datos del usuario
  //     setLoading(false)
  //   } catch (error) {
  //     console.error('Error checking auth:', error)
  //     setLoading(false)
  //   }
  // }

  const login = async (email, password) => {
    try {
      // Implementar lógica de login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) throw new Error('Login failed')

      const data = await response.json()
      setUser(data.user)
      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Llamar a la API para cerrar sesión
      await fetch('/api/auth/logout', { method: 'POST' });

      // Eliminar el token de las cookies
      document.cookie = 'auth-token=; Max-Age=0; path=/;';
      // Esto elimina el token de las cookies
      setUser (null); // Limpiar el estado del usuario
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };



  const register = async (userData) => {
    try {
      // Implementar lógica de registro
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (!response.ok) throw new Error('Registration failed')

      const data = await response.json()
      setUser(data.user)
      return data
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}