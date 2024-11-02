// index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bookingRoutes from './routes/bookingRoutes.js';
import patientsRoutes from './routes/patientsRoutes.js';
import recordsRoutes from './routes/recordsRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/bookings', bookingRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/records', recordsRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});