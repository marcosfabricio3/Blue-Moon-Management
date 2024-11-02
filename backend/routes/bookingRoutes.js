import express from "express";
import {
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getSpecificBooking,
  updateBookingsByPatientID,
} from "../controllers/bookingController.js";

const router = express.Router();

// obtener todos las reservas
router.get("/", getAllBookings);

// obtener reservas de paciente especifico
router.get("/:id", getSpecificBooking);

// crear una nueva reserva
router.post("/", createBooking);

// actualizar una reserva en especifico
router.put("/:bookingID", updateBooking);

// actualizar todas las  reservas de un paciente
router.put("/:id", updateBookingsByPatientID);

// eliminar una reserva
router.delete("/:bookingID", deleteBooking);

export default router;