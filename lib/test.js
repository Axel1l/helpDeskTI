const { PrismaClient } = require("@prisma/client");
const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");


const prisma = new PrismaClient();

async function testAuth() {
  const email = 'agent1@exa.com';
  const password = 'password123'; 

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("Usuario no encontrado");
    return;
  }

  const isPasswordCorrect = await compare(password, user.password);

  if (!isPasswordCorrect) {
    console.log("Contraseña incorrecta");
    return;
  }

  // Si la contraseña es correcta, genera el token
  const token = sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.NEXTAUTH_SECRET,
    { expiresIn: "30d" }
  );

  console.log("Autenticación exitosa. Token:", token);
}

testAuth().finally(() => prisma.$disconnect());
