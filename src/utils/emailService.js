const nodemailer = require('nodemailer');
const env = require('../config/env.config.js');

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || 'smtp.gmail.com',
  port: env.SMTP_PORT || 587,
  secure: false, 
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  }
});

/**
 * @param {string} to 
 * @param {string} subject
 * @param {string} html 
 */
const sendEmail = async (to, subject, html) => {
  if (!to) {
    console.error('No hay destinatario definido');
    return;
  }

  try {
    console.log('Enviando correo a:', to);
    const info = await transporter.sendMail({
      from: `"Reservas 🎉" <${env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log('Correo enviado:', info.messageId);
  } catch (error) {
    console.error('Error al enviar correo:', error);
    console.error('Detalle del error SMTP:', error.response || error);
  }
};


module.exports = { sendEmail };
