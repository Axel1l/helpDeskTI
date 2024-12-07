'use client'

import { Card, CardBody, CardHeader, Divider, Input, Switch, Select, SelectItem, Button } from "@nextui-org/react"
import { Save } from "lucide-react"

export default function SettingsPage() {
  const notificationTypes = [
    { value: "all", label: "Todas las notificaciones" },
    { value: "mentions", label: "Solo menciones" },
    { value: "none", label: "Ninguna" }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Configuración</h1>

      <Card>
        <CardHeader className="text-lg font-semibold">Perfil</CardHeader>
        <Divider/>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre"
              placeholder="Tu nombre"
              defaultValue="Juan Pérez"
            />
            <Input
              label="Email"
              placeholder="tu@email.com"
              defaultValue="juan@empresa.com"
            />
          </div>
          <Input
            label="Cargo"
            placeholder="Tu cargo"
            defaultValue="Técnico de Soporte"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="text-lg font-semibold">Notificaciones</CardHeader>
        <Divider/>
        <CardBody className="space-y-6">
          <Select 
            label="Preferencias de notificación"
            placeholder="Selecciona tus preferencias"
            defaultSelectedKeys={["all"]}
          >
            {notificationTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </Select>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Notificaciones por email</p>
                <p className="text-sm text-gray-500">Recibe actualizaciones por email</p>
              </div>
              <Switch defaultSelected />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Notificaciones push</p>
                <p className="text-sm text-gray-500">Recibe notificaciones en el navegador</p>
              </div>
              <Switch defaultSelected />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Sonidos de notificación</p>
                <p className="text-sm text-gray-500">Reproduce sonidos para nuevas notificaciones</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="text-lg font-semibold">Apariencia</CardHeader>
        <Divider/>
        <CardBody className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Modo oscuro</p>
              <p className="text-sm text-gray-500">Cambia entre tema claro y oscuro</p>
            </div>
            <Switch />
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end gap-2">
        <Button color="danger" variant="flat">
          Cancelar
        </Button>
        <Button color="primary" startContent={<Save size={18}/>}>
          Guardar Cambios
        </Button>
      </div>
    </div>
  )
}