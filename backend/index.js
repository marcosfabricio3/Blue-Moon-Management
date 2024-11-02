import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bookingRoutes from "./routes/bookingRoutes.js";
import patientsRoutes from "./routes/patientsRoutes.js";
import recordsRoutes from "./routes/recordsRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors());
app.use(bodyParser.json());

// rutas
app.use("/api/bookings", bookingRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/records", recordsRoutes);

// manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal!");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});