'use client'

import { useEffect, useRef } from 'react'
import io from 'socket.io-client'

export function useSocket(ticketId) {
  const socket = useRef()

  useEffect(() => {
    socket.current = io({
      path: '/api/socketio',
    })

    if (ticketId) {
      socket.current.emit('join-ticket', ticketId)
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect()
      }
    }
  }, [ticketId])

  return socket.current
}