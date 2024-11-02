// controllers/bookingController.js
import { readData, writeData } from '../utils/fileHandler.js';
import path from 'path';

const bookingHoursPath = path.join(process.cwd(), "data", "bookingHours.json");

export const getAllBookings = async (req, res) => {
  try {
    const data = await readData(bookingHoursPath);
    res.status(200).json(data.booking); // Cambia bookingHours a booking
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSpecificBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await readData(bookingHoursPath);

    // Aseguramos que el ID de la solicitud y el JSON sean ambos números
    const filteredBookings = data.booking.filter(booking => booking.id == id); 

    if (filteredBookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this patient" });
    }

    res.status(200).json(filteredBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBooking = async (req, res) => {
  const newBooking = req.body;

  try {
    const data = await readData(bookingHoursPath);

    // Obtener el bookingID único basado en el ID más alto existente
    const maxBookingID = data.booking.reduce((max, booking) => Math.max(max, booking.bookingID || 0), 0);
    newBooking.bookingID = maxBookingID + 1;

    data.booking.push(newBooking);
    await writeData(bookingHoursPath, data);

    res.status(201).json(newBooking);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBooking = async (req, res) => {
  const { bookingID } = req.params; // Asumiendo que cada reserva tiene un identificador único
  const updatedBooking = req.body;

  try {
    const data = await readData(bookingHoursPath);
    const index = data.booking.findIndex(booking => booking.bookingID === parseInt(bookingID)); // Cambia a parseInt

    if (index === -1) {
      return res.status(404).json({ message: "Booking not found" });
    }

    data.booking[index] = { ...data.booking[index], ...updatedBooking };
    await writeData(bookingHoursPath, data);
    res.status(200).json(data.booking[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBookingsByPatientID = async (req, res) => {
  const { patientID } = req.params; // El ID del paciente a actualizar
  const updatedData = req.body; // Los nuevos datos para los bookings

  try {
    const data = await readData(bookingHoursPath);

    // Filtramos y actualizamos todos los bookings que coincidan con el patientID
    let updatedBookings = false;
    data.booking = data.booking.map(booking => {
      if (booking.patientID == patientID) {
        updatedBookings = true; // Indicador de que al menos un booking fue actualizado
        return { ...booking, ...updatedData }; // Actualizamos el booking
      }
      return booking; // Mantenemos los bookings que no coinciden
    });

    if (!updatedBookings) {
      return res.status(404).json({ message: "No bookings found for this patient" });
    }

    await writeData(bookingHoursPath, data); // Guardamos los cambios
    res.status(200).json({ message: "Bookings updated successfully", updatedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  const { bookingID } = req.params;

  try {
    const data = await readData(bookingHoursPath);
    const index = data.booking.findIndex(booking => booking.bookingID === parseInt(bookingID)); // Cambia a parseInt

    if (index === -1) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const deletedBooking = data.booking.splice(index, 1);
    await writeData(bookingHoursPath, data);
    res.status(200).json(deletedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

