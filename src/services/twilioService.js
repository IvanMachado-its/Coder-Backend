const twilioClient = require('../config/twilio');

async function sendSMS(to, message) {
  try {
    await twilioClient.messages.create({
      body: message,
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  sendSMS,
};
