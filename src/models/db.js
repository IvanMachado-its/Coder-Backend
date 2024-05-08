const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Striker2001:American2014@cluster0.rw3em3q.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conexión a MongoDB establecida'))
.catch(err => console.error('Error de conexión a MongoDB:', err));

module.exports = mongoose;
