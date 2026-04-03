require('dotenv').config();
const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../')); // sirve los archivos del sitio web

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

app.post('/api/contacto', async (req, res) => {
  const { nombre, email, telefono, servicio, mensaje } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y email son obligatorios.' });
  }

  const mailOptions = {
    from: `"Web Psicología" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `Nuevo mensaje de contacto — ${nombre}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px">
        <h2 style="color:#2d4a47;margin-bottom:24px">Nuevo mensaje de contacto</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:140px"><strong>Nombre</strong></td><td style="padding:8px 0">${nombre}</td></tr>
          <tr><td style="padding:8px 0;color:#666"><strong>Email</strong></td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666"><strong>Teléfono</strong></td><td style="padding:8px 0">${telefono || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#666"><strong>Servicio</strong></td><td style="padding:8px 0">${servicio || '—'}</td></tr>
        </table>
        <hr style="margin:16px 0;border:none;border-top:1px solid #e0e0e0"/>
        <p style="color:#666"><strong>Mensaje:</strong></p>
        <p style="background:#f9f9f9;padding:16px;border-radius:6px;line-height:1.6">${mensaje || '—'}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al enviar email:', err.message);
    res.status(500).json({ error: 'No se pudo enviar el mensaje. Inténtalo de nuevo.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
