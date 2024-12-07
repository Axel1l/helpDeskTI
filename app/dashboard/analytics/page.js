'use client'

import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

const ticketsByCategory = [
  { name: 'Hardware', value: 30 },
  { name: 'Software', value: 45 },
  { name: 'Red', value: 15 },
  { name: 'Accesos', value: 25 },
  { name: 'Otros', value: 10 }
]

const ticketsByMonth = [
  { name: 'Ene', abiertos: 40, cerrados: 35 },
  { name: 'Feb', abiertos: 45, cerrados: 42 },
  { name: 'Mar', abiertos: 35, cerrados: 38 },
  { name: 'Abr', abiertos: 50, cerrados: 45 },
  { name: 'May', abiertos: 42, cerrados: 40 }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analíticas</h1>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Total Tickets</p>
            <h3 className="text-2xl font-bold">125</h3>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Tickets Abiertos</p>
            <h3 className="text-2xl font-bold">45</h3>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Tiempo Promedio Resolución</p>
            <h3 className="text-2xl font-bold">2.5h</h3>
          </CardBody>
        </Card>
        {/* <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Satisfacción Cliente</p>
            <h3 className="text-2xl font-bold">4.8/5</h3>
          </CardBody>
        </Card> */}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader className="text-lg font-semibold">Tickets por Categoría</CardHeader>
          <Divider/>
          <CardBody className="flex justify-center py-6 ">
            <PieChart width={400} height={400}>
              <Pie
                data={ticketsByCategory}
                cx={200}
                cy={150}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {ticketsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="text-lg font-semibold">Tickets por Mes</CardHeader>
          <Divider/>
          <CardBody className="flex justify-center py-6">
            <BarChart
              width={500}
              height={300}
              data={ticketsByMonth}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="abiertos" fill="#8884d8" />
              <Bar dataKey="cerrados" fill="#82ca9d" />
            </BarChart>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}