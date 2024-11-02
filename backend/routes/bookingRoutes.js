// routes/bookingRoutes.js
import express from 'express';
import {getAllBookings,createBooking,updateBooking,deleteBooking,getSpecificBooking,updateBookingsByPatientID,} from '../controllers/bookingController.js';

const router = express.Router();

// Obtener toda la data de reservas
router.get('/', getAllBookings);

// Obtener una reserva en espesifico
router.get('/:id', getSpecificBooking);

// Crear una nueva reserva
router.post('/', createBooking);

// Actualizar una reserva existente
router.put('/:bookingID', updateBooking);

// Actualizar todas las reserva existentes de un mismo paciente
router.put('/:id', updateBookingsByPatientID);

// Eliminar una reserva existente
router.delete('/:bookingID', deleteBooking);

export default router;
