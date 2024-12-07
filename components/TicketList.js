'use client'

import { useState, useEffect } from 'react'
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Pagination, Input } from "@nextui-org/react"
import { Search } from 'lucide-react'
import { useSocket } from '@/hooks/useSocket'
import { useDebounce } from '@/hooks/useDebounce'

export default function TicketList() {
  const [tickets, setTickets] = useState([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const socket = useSocket()
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    fetchTickets()
    
    socket?.on('ticket-updated', (updatedTicket) => {
      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
      )
    })

    return () => {
      socket?.off('ticket-updated')
    }
  }, [page, debouncedSearch])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/tickets?page=${page}&search=${debouncedSearch}`
      )
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusColorMap = {
    urgent: "danger",
    open: "primary",
    closed: "success",
  }

  const priorityColorMap = {
    high: "danger",
    medium: "warning",
    low: "success",
  }

  return (
    <Card>
      <CardBody>
        <div className="flex justify-between items-center mb-4">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar tickets..."
            startContent={<Search className="text-default-300" size={20} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Table
          aria-label="Tabla de tickets"
          bottomContent={
            <div className="flex justify-center">
              <Pagination
                total={10}
                page={page}
                onChange={setPage}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[400px]",
          }}
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>TÍTULO</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn>PRIORIDAD</TableColumn>
            <TableColumn>SOLICITANTE</TableColumn>
            <TableColumn>FECHA</TableColumn>
          </TableHeader>
          <TableBody
            items={tickets}
            loadingContent={<div>Cargando tickets...</div>}
            loadingState={loading ? "loading" : "idle"}
          >
            {(ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>
                  <Chip color={statusColorMap[ticket.status]} size="sm">
                    {ticket.status.toUpperCase()}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip color={priorityColorMap[ticket.priority]} size="sm">
                    {ticket.priority.toUpperCase()}
                  </Chip>
                </TableCell>
                <TableCell>{ticket.requester}</TableCell>
                <TableCell>{new Date(ticket.created).toLocaleDateString()}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  )
}