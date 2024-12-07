'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CircuitBoard } from 'lucide-react';
import { Card, CardBody, Input, Select, SelectItem, Button, Modal, ModalBody, ModalFooter, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react";

export default function RegisterPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '', // Aquí almacenaremos el rol seleccionado
  });
  const [modalMessage, setModalMessage] = useState('');

  // Los roles están definidos directamente en el componente
  const roles = [
    { value: 'AGENT', label: 'Agente' },
    { value: 'USER', label: 'Usuario' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setModalMessage("Las contraseñas no coinciden");
      onOpen();
      return;
    }

    // Crear un objeto con los datos del formulario
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setModalMessage(errorData.message || "Error al registrar el usuario");
        onOpen();
        return;
      }

      const data = await response.json();
      setModalMessage(data.message || "Usuario registrado con éxito");
      onOpen();
    } catch (error) {
      console.error('Error al registrar:', error);
      setModalMessage("Error al registrar el usuario");
      onOpen();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center">
        <CircuitBoard className="h-12 w-12 text-purple-500 mr-3" />
        <h1 className="text-2xl font-bold mb-6 mt-4" >Crear una cuenta</h1>
      </div>

      <Card >
        <CardBody>
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre completo"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  type="email"
                  label="Correo electrónico"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="password"
                  label="Contraseña"
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <Input
                  type="password"
                  label="Confirmar contraseña"
                  placeholder="********"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <Select
              label="Tipo de cuenta"
              placeholder="Selecciona tu rol"
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value })}
            >
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </Select>

              <Button
                color="primary"
                className="w-full md:w-auto"
                type="submit">
                Registrarse
              </Button>
            </form>
          </div>

          <div className="text-center">
            <Link
              href="/dashboard"
              className="font-medium text-purple-500 hover:text-purple-400">
              volver
            </Link>
          </div>
        </CardBody>

      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {modalMessage.includes("Error") ? "Error" : "Mensaje"}
          </ModalHeader>
          <ModalBody>{modalMessage}</ModalBody>
          <ModalFooter>
            <Button auto onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
}
