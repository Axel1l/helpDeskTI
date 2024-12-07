"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Input, CircularProgress, Modal, ModalBody, ModalFooter, ModalContent, ModalHeader } from "@nextui-org/react";
import { Plus, Search, Trash } from "lucide-react";
import Link from "next/link";


export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [ticketIdToDelete, setTicketIdToDelete] = useState(null);
  const [role, setRole] = useState(null); // Para almacenar el rol del usuario
  const [showAllTickets, setShowAllTickets] = useState(false); // Para determinar si el agente debe ver todos los tickets


  const statusColorMap = {
    urgent: "var(--danger-color)",
    OPEN: "var(--success-color)",
    closed: "var(--success-color)",
  };

  const priorityColorMap = {
    high: "var(--danger-color)",
    MEDIUM: "var(--warning-color)",
    low: "var(--success-color)",
  };

  const getStatusColor = (status) => ({ backgroundColor: statusColorMap[status] || "var(--default-bg-color)" });
  const getPriorityColor = (priority) => ({ backgroundColor: priorityColorMap[priority] || "var(--default-bg-color)" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // Obtener el usuario de localStorage
    const user = storedUser ? JSON.parse(storedUser) : null; // Parsear el JSON
    if (user) {
      setRole(user.role); // Establecer el rol en el estado
    }

    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/tickets");
        if (!response.ok) {
          throw new Error("Error al obtener los tickets");
        }
        const data = await response.json();

        // Filtrar tickets dependiendo del rol del usuario
        if (user?.role === "USER") {
          // Filtrar solo los tickets creados por el usuario
          const userTickets = data.filter((ticket) => ticket.creatorId === user.id);
          setTickets(userTickets);
        } else if (user?.role === "AGENT") {
          // Si el agente quiere ver solo los tickets asignados, filtrar por 'assigneeId'
          const agentTickets = showAllTickets
            ? data // Si el agente quiere ver todos los tickets, no se filtra
            : data.filter((ticket) => ticket.assigneeId === user.id);
          setTickets(agentTickets);
        }
      } catch (error) {
        console.error("Error al obtener los tickets:", error);
        alert("Hubo un problema al cargar los tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [showAllTickets]); // Re-cargar tickets cuando cambie el estado de `showAllTickets`

  const handleDelete = async (ticketId) => {
    setTicketIdToDelete(ticketId);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!ticketIdToDelete) return;

    try {
      const response = await fetch(`/api/tickets/${ticketIdToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el ticket");
      }

      alert("Ticket eliminado exitosamente");
      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== ticketIdToDelete));
    } catch (error) {
      console.error("Error al eliminar el ticket:", error);
      alert("Error al eliminar el ticket");
    } finally {
      setConfirmDeleteOpen(false);
      setTicketIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setTicketIdToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <CircularProgress aria-label="Loading..." />
      </div>
    );
  }

  const filteredTickets = tickets.filter((ticket) => {
    const searchTermLower = searchTerm.toLowerCase();

    // Compara con los diferentes campos de la tabla
    return (
      ticket.id.toString().includes(searchTermLower) ||      // Filtrar por ID
      ticket.title.toLowerCase().includes(searchTermLower) || // Filtrar por título
      ticket.status.toLowerCase().includes(searchTermLower) || // Filtrar por estado
      ticket.priority.toLowerCase().includes(searchTermLower) || // Filtrar por prioridad
      (ticket.assignee?.name?.toLowerCase().includes(searchTermLower)) || // Filtrar por solicitante
      new Date(ticket.createdAt).toLocaleDateString().includes(searchTermLower) // Filtrar por fecha
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <Link href="/dashboard/tickets/create">
          <Button style={{ backgroundColor: 'var(--primary-color)' }} endContent={<Plus size={20} />}>
            Nuevo Ticket
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6 items-center">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Buscar tickets..."
          startContent={<Search className="text-default-300" size={20} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {role === "AGENT" && (
          <Button style={{ backgroundColor: 'var(--primary-color)' }} onClick={() => setShowAllTickets((prev) => !prev)}>
            {showAllTickets ? "Ver solo asignados" : "Ver todos los tickets"}
          </Button>
        )}
      </div>

      <Table aria-label="Tabla de tickets">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>TÍTULO</TableColumn>
          <TableColumn>ESTADO</TableColumn>
          <TableColumn>PRIORIDAD</TableColumn>
          <TableColumn>SOLICITANTE</TableColumn>
          <TableColumn>FECHA</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredTickets.map((ticket) => (
            <TableRow key={ticket.id} onClick={() => (window.location.href = `/dashboard/tickets/${ticket.id}`)} style={{ cursor: "pointer" }} className="hover:bg-gradient hover-cell">
              <TableCell>{ticket.id}</TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>
                <Chip style={getStatusColor(ticket.status)} variant="flat" size="sm">
                  {ticket.status}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip style={getPriorityColor(ticket.priority)} variant="flat" size="sm">
                  {ticket.priority}
                </Chip>
              </TableCell>
              <TableCell>{ticket.assignee?.name}</TableCell>
              <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="flex gap-4">
                <Button
                  color="danger"
                  variant="flat"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(ticket.id);
                  }}
                >
                  <Trash size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de Confirmación */}
      <Modal isOpen={isConfirmDeleteOpen} onClose={cancelDelete}>
        <ModalContent>
          <ModalHeader>
            <h2>Confirmar Eliminación</h2>
          </ModalHeader>
          <ModalBody>
            <p>¿Estás seguro de que deseas eliminar este ticket?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={confirmDelete}>
              Aceptar
            </Button>
            <Button auto onClick={cancelDelete}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
