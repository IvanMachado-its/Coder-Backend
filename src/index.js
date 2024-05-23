// src/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
require('./config/passport')(passport);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/carts', require('./routes/cartsRouter'));
app.use('/api/users', require('./routes/usersRouter'));
app.use('/api/products', require('./routes/productsRouter'));
app.use('/api/auth', require('./routes/authRouter'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
