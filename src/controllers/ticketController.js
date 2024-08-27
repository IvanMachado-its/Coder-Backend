const Ticket = require('../models/Ticket');
const twilio = require('twilio');

// Credenciales de Twilio proporcionadas
const accountSid = 'AC293c3f9c31163a433117c6442db241f2';
const authToken = '90d1140d1ee6034914fc0b07ef5c62d5';
const client = twilio(accountSid, authToken);

// Número de teléfono de Twilio
const twilioPhoneNumber = '+19784124569';

// Función para generar un código aleatorio único
function generateUniqueCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
}

// Controlador para crear un nuevo ticket
exports.createTicket = async (req, res) => {
  try {
    const { purchaser, amount, products } = req.body;

    // Generar código único para el ticket
    const code = generateUniqueCode(8);

    // Crear el ticket en la base de datos
    const newTicket = new Ticket({
      code,
      purchase_datetime: new Date(),
      amount,
      purchaser,
      products
    });

    await newTicket.save();

    // Enviar mensaje de texto con Twilio
    const message = `Gracias por tu compra. Detalles del ticket: Código: ${code}, Total: ${amount}`;
    await client.messages.create({
      body: message,
      to: purchaser,
      from: twilioPhoneNumber
    });

    res.status(201).json(newTicket);
  } catch (err) {
    console.error('Error al crear el ticket:', err);
    res.status(500).json({ message: 'Error al crear el ticket' });
  }
};

// Middleware para verificar si un ticket está completo
exports.verifyCompletedPurchase = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const unprocessedProducts = ticket.products.filter(product => !product.processed);
    res.status(200).json({ unprocessedProducts });
  } catch (err) {
    console.error('Error al verificar compra completada:', err);
    res.status(500).json({ message: 'Error al verificar compra completada' });
  }
};

// Código adicional de Twilio para verificar con servicio específico
client.verify.v2.services("VAffcce80bb67483487b476be454964968")
      .verifications
      .create({ to: '+59893484258', channel: 'sms' })
      .then(verification => console.log(verification.sid))
      .catch(err => console.error('Error en la verificación:', err));
