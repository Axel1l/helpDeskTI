'use client'

import { Card, CardBody } from "@nextui-org/react"
import { Ticket, Clock, Users, AlertCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const recentActivity = [
  {
    id: 1,
    type: "ticket_created",
    message: "Nuevo ticket creado: Problema con impresora",
    time: "Hace 5 minutos"
  },
  {
    id: 2,
    type: "ticket_resolved",
    message: "Ticket resuelto: Error en servidor de correo",
    time: "Hace 30 minutos"
  },
  {
    id: 3,
    type: "agent_assigned",
    message: "Ana Martínez asignada a ticket #1234",
    time: "Hace 1 hora"
  }
]

const weeklyStats = [
  { day: 'Lun', tickets: 12 },
  { day: 'Mar', tickets: 19 },
  { day: 'Mie', tickets: 15 },
  { day: 'Jue', tickets: 22 },
  { day: 'Vie', tickets: 18 },
  { day: 'Sab', tickets: 8 },
  { day: 'Dom', tickets: 5 }
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de Control</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-purple-500/10 border border-purple-500/20">
          <CardBody className="flex flex-row items-center gap-4">
            <Ticket className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-400">Tickets Activos</p>
              <p className="text-2xl font-bold">28</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-blue-500/10 border border-blue-500/20">
          <CardBody className="flex flex-row items-center gap-4">
            <Clock className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-400">Tiempo Promedio</p>
              <p className="text-2xl font-bold">2.5h</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-green-500/10 border border-green-500/20">
          <CardBody className="flex flex-row items-center gap-4">
            <Users className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-400">Agentes Online</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-orange-500/10 border border-orange-500/20">
          <CardBody className="flex flex-row items-center gap-4">
            <AlertCircle className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm text-gray-400">Tickets Urgentes</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Tickets por Día</h3>
            <BarChart
              width={500}
              height={300}
              data={weeklyStats}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tickets" fill="#8884d8" />
            </BarChart>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-content2">
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}