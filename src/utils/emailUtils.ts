import User from '../models/User';
import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASSWORD } from '../config/config';

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

export const sendInactivityEmails = async () => {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  try {
    const inactiveUsers = await User.find({ lastLogin: { $lt: twoDaysAgo } });
    inactiveUsers.forEach(async (user) => {
      await transporter.sendMail({
        from: EMAIL_USER,
        to: user.email,
        subject: 'Cuenta eliminada por inactividad',
        text: `Hola ${user.name}, tu cuenta ha sido eliminada debido a inactividad.`
      });
      await user.remove();
    });
    console.log('Usuarios inactivos eliminados y correos enviados');
  } catch (error) {
    console.error('Error al enviar correos de inactividad', error);
  }
};
