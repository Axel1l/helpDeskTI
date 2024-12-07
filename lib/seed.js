const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");


const prisma = new PrismaClient();

async function createDefaultUsers() {
  try {
    const password = 'password123';
    const hashedPassword = await hash(password, 12);

    const agents = ['agent1', 'agent2', 'agent3'];
    for (let i = 0; i < agents.length; i++) {
      const existingUser = await prisma.user.findUnique({
        where: { email: `${agents[i]}@example.com` },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            name: `Agente ${i + 1}`,
            email: `${agents[i]}@exa.com`,
            password: hashedPassword,
            role: 'AGENT',
            username: agents[i],
          },
        });
        console.log(`Usuario ${agents[i]} creado como AGENT`);
      } else {
        console.log(`El usuario ${agents[i]} ya existe como AGENT`);
      }
    }

    const clients = ['roger', 'raul', 'mendez'];
    for (let i = 0; i < clients.length; i++) {
      const existingUser = await prisma.user.findUnique({
        where: { email: `${clients[i]}@exa.com` },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            name: `Cliente ${i + 1}`,
            email: `${clients[i]}@example.com`,
            password: hashedPassword,
            role: 'USER',
            username: clients[i],
          },
        });
        console.log(`Usuario ${clients[i]} creado como Empleado`);
      } else {
        console.log(`El usuario ${clients[i]} ya existe como Empleado`);
      }
    }
  } catch (error) {
    console.error('Error al crear los usuarios:', error);
  }
}

createDefaultUsers();
