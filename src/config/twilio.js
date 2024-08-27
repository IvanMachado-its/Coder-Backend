const twilio = require('twilio');

const accountSid = 'AC293c3f9c31163a433117c6442db241f2'; // Define tu SID de cuenta de Twilio aquí
const authToken = '90d1140d1ee6034914fc0b07ef5c62d5'; // Define tu token de autenticación de Twilio aquí
const client = twilio(accountSid, authToken);
const twilioPhoneNumber = '+19784124569'; // Número de teléfono de Twilio


module.exports = client;
