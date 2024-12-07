"use client";

import { Card, CardBody, Input, Textarea, Select, SelectItem, Button, Modal, ModalBody, ModalFooter, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react";
import { Save, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
export default function CreateTicketPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isClient, setIsClient] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    userId: "",
    assignedId: "",
    assignedName: "",
    category: "",
    priority: "MEDIUM",
    status: "OPEN",
  });
  const [images, setImages] = useState([]);
  const [agents, setAgents] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const fetchAgents = async () => {
      try {
        const agents = await getAgents();
        if (agents.length === 0) throw new Error("No se encontraron agentes");

        // Encuentra el agente con menos tickets asignados
        const agentWithLeastTickets = findAgentWithLeastTickets(agents);
        setNewTicket((prev) => ({ ...prev, assignedId: agentWithLeastTickets.id, assignedName: agentWithLeastTickets.name }));
        setAgents(agents); // Guarda la lista de agentes
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user?.id) {
        setNewTicket((prev) => ({ ...prev, userId: user.id }));
      }
    } catch (error) {
      console.error("Error al encontrar el usuario:", error);
    }

    fetchAgents();
  }, []);

  const getAgents = async () => {
    const response = await fetch("/api/users?role=AGENT");
    if (!response.ok) throw new Error("Error al obtener los agentes");
    return await response.json();
  };

  const findAgentWithLeastTickets = (agents) => {
    return agents.reduce((prev, current) => (prev.ticketCount < current.ticketCount ? prev : current));
  };

  if (!isClient) return <div>Cargando agentes...</div>;

  const categories = [
    { value: "HARDWARE", label: "Hardware" },
    { value: "SOFTWARE", label: "Software" },
    { value: "NETWORK", label: "Red" },
    { value: "ACCESS", label: "Accesos" },
    { value: "OTHER", label: "Otros" },
  ];

  const handleCategoryChange = (value) => {
    setNewTicket((prev) => ({ ...prev, category: value }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    if (files.length + images.length > 2) {
      alert("No puedes subir más de 2 imágenes");
      return;
    }
    setImages((prevImages) => {
      const updatedImages = [...prevImages, ...files].slice(0, 2);
      return updatedImages;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const ticketData = {
      title: newTicket.title,
      description: newTicket.description,
      category: newTicket.category,
      priority: newTicket.priority,
      status: newTicket.status,
      userId: newTicket.userId,
      assignedId: newTicket.assignedId,
    };

    try {
      const ticketResponse = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData), // Serializa el objeto como JSON
      });

      if (!ticketResponse.ok) throw new Error("Error al crear el ticket");

      const ticket = await ticketResponse.json();
      console.log(ticket);

      setModalMessage("Ticket creado con éxito");
      onOpen();
    } catch (error) {
      console.error("Error en la creación del ticket:", error);
      setModalMessage("Error al crear el ticket. Inténtalo de nuevo.");
      onOpen();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Ticket</h1>

      <Card>
        <CardBody className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="space-y-6">
            <Input
              label="Título"
              placeholder="Describe brevemente el problema"
              required
              value={newTicket.title}
              onChange={(e) => setNewTicket((prev) => ({ ...prev, title: e.target.value }))}
              className="text-gray-400 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            />

            <Select label="Categoría" placeholder="Selecciona una categoría" required value={newTicket.category} onChange={(e) => handleCategoryChange(e.target.value)}>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>

            <Textarea
              label="Descripción"
              placeholder="Describe detalladamente el problema"
              minRows={4}
              required
              value={newTicket.description}
              onChange={(e) => setNewTicket((prev) => ({ ...prev, description: e.target.value }))}
            />

            <Input className="hidden" label="Asignar a" placeholder="Agente asignado" value={newTicket.assignedName} readOnly  />
          </div>

        </CardBody>

        <div className="flex justify-end gap-2 p-4">
          <Button color="danger" variant="flat" onClick={() => {
              router.push('/dashboard/tickets'); // Redirige a la página de tickets
            }} >
            Cancelar
          </Button>
          <Button style={{ backgroundColor: 'var(--success-color)' }} variant="flat" startContent={<Save size={18} />} onClick={handleSubmit}>
            Crear Ticket
          </Button>
        </div>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{modalMessage.includes("Error") ? "Error" : "Mensaje"}</ModalHeader>
          <ModalBody>{modalMessage}</ModalBody>
          <ModalFooter>
            <Button auto color="primary" onClick={() => {
              onClose(); // Cierra el modal
              router.push('/dashboard/tickets'); // Redirige a la página de tickets
            }}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
