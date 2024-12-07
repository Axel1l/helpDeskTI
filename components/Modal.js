import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React from 'react';

const Modal = ({ isOpen, message, onClose, type }) => {
  if (!isOpen) return null; 

  return (
<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Mensaje</ModalHeader>
              <ModalBody>
                <p>{modalMessage}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={onClose}>
                  Acción
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  );
};

export default Modal;
