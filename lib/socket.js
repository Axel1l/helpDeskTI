import { Server } from 'socket.io'

export const initSocket = (server) => {
  const io = new Server(server, {
    path: '/api/socketio',
  })

  io.on('connection', (socket) => {
    socket.on('join-ticket', (ticketId) => {
      socket.join(`ticket-${ticketId}`)
    })

    socket.on('ticket-update', (ticketId, data) => {
      io.to(`ticket-${ticketId}`).emit('ticket-updated', data)
    })

    socket.on('new-comment', (ticketId, comment) => {
      io.to(`ticket-${ticketId}`).emit('comment-added', comment)
    })
  })

  return io
}