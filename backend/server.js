const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

dotenv.config();

//  DATABASE 
connectDB();

const app = express();

//  MIDDLEWARE 

// JSON parser
app.use(express.json());

// URL encoded parser (formularios)
app.use(express.urlencoded({ extended: true }));

//  CORS (PRODUCCIÓN) 
app.use(cors({
  origin: '*', 
  credentials: true
}));

//  ROUTES 
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// HEALTH CHECK
app.get('/', (req, res) => {
  res.json({
    message: 'API Task App funcionando 🚀'
  });
});

//  PORT 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});