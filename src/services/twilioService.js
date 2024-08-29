const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendSmsNotification = (to, message) => {
  client.messages
    .create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    })
    .then(message => console.log('Mensaje enviado: ', message.sid))
    .catch(error => console.error('Error enviando mensaje: ', error));
};
