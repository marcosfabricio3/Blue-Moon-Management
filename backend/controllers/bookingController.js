import { readData, writeData } from "../utils/fileHandler.js";
import path from "path";

const bookingHoursPath = path.join(process.cwd(), "data", "bookingHours.json");

// obtener todos las reservas
export const getAllBookings = async (req, res) => {
  try {
    const data = await readData(bookingHoursPath);
    res.status(200).json(data.booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// obtener reservas de paciente especifico
export const getSpecificBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await readData(bookingHoursPath);
    const filteredBookings = data.booking.filter((booking) => booking.id == id);
    if (filteredBookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this patient" });
    }
    res.status(200).json(filteredBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// crear una nueva reserva
export const createBooking = async (req, res) => {
  const newBooking = req.body;
  try {
    const data = await readData(bookingHoursPath);
    const maxBookingID = data.booking.reduce(
      (max, booking) => Math.max(max, booking.bookingID || 0),
      0
    );
    newBooking.bookingID = maxBookingID + 1;
    data.booking.push(newBooking);
    await writeData(bookingHoursPath, data);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// actualizar una reserva en especifico
export const updateBooking = async (req, res) => {
  const { bookingID } = req.params;
  const updatedBooking = req.body;
  try {
    const data = await readData(bookingHoursPath);
    const index = data.booking.findIndex(
      (booking) => booking.bookingID === parseInt(bookingID)
    );
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

// actualizar todas las  reservas de un paciente
export const updateBookingsByPatientID = async (req, res) => {
  const { patientID } = req.params;
  const updatedData = req.body;
  try {
    const data = await readData(bookingHoursPath);
    let updatedBookings = false;
    data.booking = data.booking.map((booking) => {
      if (booking.patientID == patientID) {
        updatedBookings = true;
        return { ...booking, ...updatedData };
      }
      return booking;
    });
    if (!updatedBookings) {
      return res
        .status(404)
        .json({ message: "No bookings found for this patient" });
    }
    await writeData(bookingHoursPath, data);
    res
      .status(200)
      .json({ message: "Bookings updated successfully", updatedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// eliminar una reserva
export const deleteBooking = async (req, res) => {
  const { bookingID } = req.params;
  try {
    const data = await readData(bookingHoursPath);
    const index = data.booking.findIndex(
      (booking) => booking.bookingID === parseInt(bookingID)
    );
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