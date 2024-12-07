'use client'
import { Save, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { Card, CardBody, CardHeader, Chip, Divider, Avatar, Button, CircularProgress, Input, Modal, ModalBody, ModalFooter, ModalContent, ModalHeader } from "@nextui-org/react"
import { Clock, MessageSquare, Paperclip } from "lucide-react"
import { useEffect, useState } from "react"

export default function TicketDetailsPage({ params }) {
  const [ticketId, setTicketId] = useState(null); // Inicializamos como null
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

   // Nuevo estado para el modal y opciones de ticket
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [newStatus, setNewStatus] = useState(ticket?.status || '');
   const [newPriority, setNewPriority] = useState(ticket?.priority || '');

   // Funciones para manejar el modal
   const openModal = () => setIsModalOpen(true);
   const closeModal = () => setIsModalOpen(false);

   // Función para actualizar el estado y la prioridad
   const handleSaveChanges = async () => {
     try {
       const response = await fetch(`/api/tickets/${ticketId}`, {
         method: 'PUT',
         body: JSON.stringify({ status: newStatus, priority: newPriority }),
         headers: { 'Content-Type': 'application/json' },
       });
       if (!response.ok) throw new Error('Error al actualizar el ticket');

       // Actualiza los valores en el estado del ticket
       setTicket(prev => ({ ...prev, status: newStatus, priority: newPriority }));
       closeModal();
     } catch (error) {
       setError(error.message);
     }
   };

  useEffect(() => {
    // Esperar a que 'params' se resuelva antes de usarlo
    const fetchTicketId = async () => {
      const resolvedParams = await params; // Esperamos la promesa de `params`
      setTicketId(resolvedParams.ticketId); // Ahora podemos acceder a ticketId

      const fetchTicket = async () => {
        if (!resolvedParams.ticketId) return;
        try {
          setLoading(true);
          const response = await fetch(`/api/tickets/${resolvedParams.ticketId}`);
          if (!response.ok) {
            throw new Error('Error al obtener el ticket');
          }
          const data = await response.json();
          setTicket(data);
        } catch (error) {
          setError(error.message);
          console.error("Error al cargar el ticket:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchTicket(); // Llamamos la función para obtener el ticket
    };

    fetchTicketId();
  }, [params]); // Esto asegura que `params` se observe correctamente

  const handleUpdateStatus = async () => {
    const updatedTicket = await fetch(`/api/tickets/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'nuevoEstado' }), // Cambia 'nuevoEstado' al estado que desees
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!updatedTicket.ok) {
      setError('Error al actualizar el estado');
    } else {
      // Actualizar la UI con el nuevo estado
      setTicket(prev => ({ ...prev, status: 'nuevoEstado' }));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    // Validar si `requester` existe para evitar el error
    const authorId = ticket?.requester?.id || null;

    // Si no se tiene un `authorId`, muestra un mensaje de error o realiza una acción alternativa
    if (!authorId) {
      setError('No se puede agregar el comentario: no se encontró el solicitante del ticket.');
      return;
    }

    try {
      const response = await fetch(`/api/tickets/${ticketId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          content: newComment,
          authorId: authorId, // Usar el authorId validado
          ticketId: ticket.id,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Error al agregar el comentario');
      }

      const addedComment = await response.json();
      setTicket((prev) => ({
        ...prev,
        comments: [...prev.comments, addedComment],
      }));
      setNewComment('');
    } catch (error) {
      setError(error.message);
    }
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

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    await fetch(`/api/tickets/${ticketId}/attachments`, {
      method: 'POST',
      body: formData,
    });



    // Aquí podrías agregar lógica para manejar la respuesta, como actualizar la UI con los archivos adjuntos.
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <CircularProgress aria-label="Loading..." />
        <p className="ml-4">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const statusColorMap = {
    URGENT: "var(--danger-color)",
    OPEN: "var(--success-color)",
    CLOSED: "var(--success-color)",
  };

  const priorityColorMap = {
    HIGH: "var(--danger-color)",
    MEDIUM: "var(--warning-color)",
    LOW: "var(--success-color)",
  };

  const getStatusColor = (status) => ({ backgroundColor: statusColorMap[status] || "var(--default-bg-color)" });
const getPriorityColor = (priority) => ({ backgroundColor: priorityColorMap[priority] || "var(--default-bg-color)" });


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">{ticket.title}</h1>
          <div className="flex gap-3">
            <Chip style={{ backgroundColor: 'var(--primary-color)' }} size="sm">ID: {ticket.id}</Chip>
            <Chip style={getStatusColor(ticket.status)} variant="flat" size="sm">{ticket.status}</Chip>
          <Chip style={getPriorityColor(ticket.priority)} variant="flat" size="sm">{ticket.priority}</Chip>
          </div>
        </div>
        <div className="space-y-6">
      {/* Botón para abrir el modal */}
      <Button style={{ backgroundColor: 'var(--primary-color)' }} onClick={openModal}>
        Actualizar Estado
      </Button>

      {/* Modal para cambiar estado y prioridad */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent>
          <ModalHeader>Actualizar Estado y Prioridad</ModalHeader>
          <ModalBody>
            <label>
            Actualizar Estado:
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="OPEN">Abierto</option>
                <option value="CLOSED">Cerrado</option>
                <option value="URGENT">Urgente</option>
              </select>
            </label>
            <label>
              Actualizar Prioridad:
              <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                <option value="HIGH">Alta</option>
                <option value="MEDIUM">Media</option>
                <option value="LOW">Baja</option>
              </select>
            </label>
          </ModalBody>
          <ModalFooter>
            <Button auto flat onClick={closeModal}>Cancelar</Button>
            <Button auto onClick={handleSaveChanges}>Guardar Cambios</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader className="text-lg font-semibold">Descripción</CardHeader>
            <Divider />
            <CardBody>
              <p>{ticket.description}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Comentarios</h3>
              <Button
                style={{ backgroundColor: 'var(--secondary-color)' }}
                variant="flat"
                startContent={<MessageSquare size={18} />}
                onClick={handleAddComment}
              >
                Añadir Comentario
              </Button>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
              {ticket.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar src={comment.user.avatar} size="sm" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{comment.user.name}</span>
                      <span className="text-sm text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
              <div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Escribe tu comentario"
                />
                {/* <Button
                color="primary"
                variant="flat"
                startContent={<MessageSquare size={18} />}
                onClick={handleAddComment}
              >
                Añadir Comentario
              </Button> */}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="text-lg font-semibold">Detalles</CardHeader>
            <Divider />
            <CardBody className="space-y-4">
              {/* Comprobación para 'requester' */}
              {ticket.requester && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Solicitante</p>
                  <div className="flex items-center gap-2">
                    {ticket.requester.avatar && (
                      <Avatar src={ticket.requester.avatar} size="sm" />
                    )}
                    <div>
                      <p className="font-medium">{ticket.requester.name}</p>
                      <p className="text-sm text-gray-500">{ticket.requester.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Comprobación para 'assignee' */}
              {ticket.assignee && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Asignado a</p>
                  <div className="flex items-center gap-2">
                    {ticket.assignee.avatar && (
                      <Avatar src={ticket.assignee.avatar} size="sm" />
                    )}
                    <div>
                      <p className="font-medium">{ticket.assignee.name}</p>
                      <p className="text-sm text-gray-500">{ticket.assignee.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-1">Fechas</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" />
                    <div>
                      <p className="text-sm">Creado: {new Date(ticket.createdAt).toLocaleString()}</p>
                      <p className="text-sm">Actualizado: {new Date(ticket.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full">
            <div className="relative w-full">
              <div className="flex items-center justify-center w-full">
                <Input id="file-input" type="file" accept="image/*" size="lg" multiple onChange={handleFileChange} className="hidden" />

                <Button radius="md" size="lg" onClick={() => document.getElementById("file-input").click()} className="w-full py-2 text-white bg-default-100 hover:bg-gray-600">
                  Subir imágenes del problema
                </Button>
              </div>
              <div className="mt-4">
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="relative flex flex-col items-center">
                          <Image src={image.preview} alt={`Preview ${index}`} width={200} height={200} className="rounded-lg shadow-lg border border-gray-300" unoptimized />
                          <Button
                            onClick={() => {
                              setImages((prevImages) => prevImages.filter((_, i) => i !== index));
                            }}
                            aria-label="Eliminar imagen"
                            auto
                            color="danger"
                            size="lg"
                            className="absolute top-0 right-0 p-2 rounded-full border-2 border-white bg-opacity-75 backdrop-blur-md hover:bg-opacity-90"
                            isIconOnly
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <em className="text-sm text-gray-500 mt-1 ml-5">(Puedes seleccionar múltiples imágenes)</em>
                )}
              </div>
            </div>
          </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
