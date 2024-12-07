import multer from 'multer';
import nextConnect from 'next-connect';
import fs from 'fs';
import path from 'path';
import prisma from '../../lib/prisma'; 

// Configuración de multer para almacenar archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './public/uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Usamos nextConnect para manejar múltiples middlewares
const handler = nextConnect()
  .use(upload.single('attachment')) 
  .post(async (req, res) => {
    try {
      const attachment = await prisma.attachment.create({
        data: {
          filePath: `/uploads/${req.file.filename}`,
          ticketId: req.body.ticketId, 
        },
      });

      res.status(200).json({ success: true, attachment });
    } catch (error) {
      console.error('Error al guardar archivo:', error);
      res.status(500).json({ success: false, message: 'Error al guardar el archivo' });
    }
  });

export default handler;
