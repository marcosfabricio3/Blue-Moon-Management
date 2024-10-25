import express from "express";
import fs from "fs/promises"; // Promesas para async/await
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json()); // Usa nativo de Express para parsear JSON

// Define __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataUsersPath = path.join(__dirname, "dataUsers.json");
const dataBookingPath = path.join(__dirname, "bookingHours.json");
const dataRecordPath = path.join(__dirname, "record.json");

// Funciones de lectura/escritura genéricas para evitar repetición
const readData = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading data from ${filePath}: ${error.message}`);
  }
};

const writeData = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error(`Error writing data to ${filePath}: ${error.message}`);
  }
};

//<--<--<-- RUTAS DE PACIENTES -->-->-->

// VER TODOS LOS PACIENTES
app.get("/patients", async (req, res) => {
  try {
    const data = await readData(dataUsersPath);
    res.status(200).json(data.patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// VER PACIENTE EN ESPECÍFICO
app.get("/patients/:id", async (req, res) => {
  try {
    const data = await readData(dataUsersPath);
    const id = parseInt(req.params.id);
    const patient = data.patients.find((patient) => patient.id === id);

    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NUEVO PACIENTE
app.post("/patients/new", async (req, res) => {
  try {
    const data = await readData(dataUsersPath);
    const body = req.body;
    let newId = data.patients.length + 1;

    // Verifica si el ID ya existe
    const idExists = (id) => data.patients.some((patient) => patient.id === id);
    while (idExists(newId)) {
      newId++;
    }

    const newPatient = { id: newId, ...body };
    data.patients.push(newPatient);
    await writeData(dataUsersPath, data);

    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EDITAR PACIENTE
app.put("/patients/:id", async (req, res) => {
  try {
    const data = await readData(dataUsersPath);
    const id = parseInt(req.params.id);
    const patientIndex = data.patients.findIndex(
      (patient) => patient.id === id
    );

    if (patientIndex === -1) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    data.patients[patientIndex] = {
      ...data.patients[patientIndex],
      ...req.body,
    };
    await writeData(dataUsersPath, data);
    res.status(200).json({ message: "Paciente actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ELIMINAR PACIENTE
app.delete("/patients/:id", async (req, res) => {
  try {
    const data = await readData(dataUsersPath);
    const id = parseInt(req.params.id);
    const patientIndex = data.patients.findIndex(
      (patient) => patient.id === id
    );

    if (patientIndex === -1) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    data.patients.splice(patientIndex, 1);
    await writeData(dataUsersPath, data);
    res.status(200).json({ message: "Paciente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//<--<--<-- RUTAS DE HORAS AGENDADAS -->-->-->

// VER TODAS LAS HORAS AGENDADAS
app.get("/booking", async (req, res) => {
  try {
    const data = await readData(dataBookingPath);
    res.status(200).json(data.booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// VER HORA AGENDADA ESPECÍFICA
app.get("/booking/:id", async (req, res) => {
  try {
    const data = await readData(dataBookingPath);
    const id = parseInt(req.params.id);
    const booking = data.booking.find((booking) => booking.id === id);

    if (!booking) {
      return res.status(404).json({ message: "Hora agendada no encontrada" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NUEVA HORA AGENDADA
app.post("/booking/new", async (req, res) => {
  try {
    const data = await readData(dataBookingPath);
    const body = req.body;
    let newId = data.booking.length + 1;

    // Verifica si el ID ya existe
    const idExists = (id) => data.booking.some((booking) => booking.id === id);
    while (idExists(newId)) {
      newId++;
    }

    const newHour = { id: newId, ...body };
    data.booking.push(newHour);
    await writeData(dataBookingPath, data);

    res.status(201).json(newHour);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EDITAR HORA AGENDADA
app.put("/booking/:id", async (req, res) => {
  try {
    const data = await readData(dataBookingPath);
    const id = parseInt(req.params.id);
    const bookingIndex = data.booking.findIndex((booking) => booking.id === id);

    if (bookingIndex === -1) {
      return res.status(404).json({ message: "Hora agendada no encontrada" });
    }

    data.booking[bookingIndex] = { ...data.booking[bookingIndex], ...req.body };
    await writeData(dataBookingPath, data);
    res
      .status(200)
      .json({ message: "Hora agendada actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ELIMINAR HORA AGENDADA
app.delete("/booking/:id", async (req, res) => {
  try {
    const data = await readData(dataBookingPath);
    const id = parseInt(req.params.id);
    const bookingIndex = data.booking.findIndex((booking) => booking.id === id);

    if (bookingIndex === -1) {
      return res.status(404).json({ message: "Hora agendada no encontrada" });
    }

    data.booking.splice(bookingIndex, 1);
    await writeData(dataBookingPath, data);
    res.status(200).json({ message: "Hora agendada eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//<--<--<-- RUTAS DE HISTORIAL-->-->-->

// VER TODAS LAS HORAS AGENDADAS HISTORICAMENTE
app.get("/records", async (req, res) => {
  try {

    // Leemos los datos del archivo de registros
    const data = await readData(dataRecordPath);

    // Obtenemos todos los registros de todos los pacientes
    const allRecords = data.patient.flatMap((patient) => patient.record);

    // Devolvemos los registros
    res.status(200).json(allRecords);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// VER HORA HISTORICA ESPECÍFICA
app.get("/patients/:patientID/records", async (req, res) => {
  try {
    
    const patientID = parseInt(req.params.patientID);    // Obtenemos el patientID de los parámetros de la solicitud
    const data = await readData(dataRecordPath);  // Leer los datos del archivo record.json
    const patient = data.patient.find(p => p.patientID === patientID);    // Buscar al paciente por patientID

    if (!patient) {
      return res.status(404).json({ error: `No se encontró el paciente con ID ${patientID}` });
    }

    res.status(200).json(patient.record);    // Devolver los registros del paciente
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // NUEVA HORA DEL HISTORIAL
app.post("/patients/:patientID/records", async (req, res) => {
  try {

    const patientID = parseInt(req.params.patientID);     // Obtener el patientID de los parámetros
    const newRecord = req.body;       // Obtener los datos del nuevo registro desde el cuerpo de la solicitud
    const data = await readData(dataRecordPath);        // Leer los datos del archivo record.json
    const patient = data.patient.find(p => p.patientID === patientID);       // Buscar al paciente por patientID

    if (!patient) {
      return res.status(404).json({ error: `No se encontró el paciente con ID ${patientID}` });
    }

    const newRecordID = patient.record.length ? patient.record[patient.record.length - 1].id + 1 : 1;        // Generar un nuevo ID para el registro
    newRecord.id = newRecordID;

    patient.record.push(newRecord);        // Agregar el nuevo registro a la lista de registros del paciente

    await writeData(dataRecordPath, data);      // Guardar los datos actualizados en el archivo record.json

    res.status(201).json(newRecord);    // Responder con el nuevo registro agregado
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EDITAR HORA DEL HISTORIAL
app.put("/patients/:patientID/records/:recordID", async (req, res) => {
  try {

    const patientID = parseInt(req.params.patientID);        // Obtener el patientID y el recordID de los parámetros de la solicitud
    const recordID = parseInt(req.params.recordID);
    const updatedRecord = req.body;        // Obtener los datos de la actualización desde el cuerpo de la solicitud
    const data = await readData(dataRecordPath);        // Leer los datos del archivo record.json

    const patient = data.patient.find(p => p.patientID === patientID);      // Buscar al paciente por patientID
    if (!patient) {
      return res.status(404).json({ error: `No se encontró el paciente con ID ${patientID}` });
    }

    const recordIndex = patient.record.findIndex(r => r.id === recordID);        // Buscar el registro específico por recordID
    if (recordIndex === -1) {
      return res.status(404).json({ error: `No se encontró el registro con ID ${recordID}` });
    }

    patient.record[recordIndex] = { ...patient.record[recordIndex], ...updatedRecord };        // Actualizar los datos del registro específico
    await writeData(dataRecordPath, data);        // Guardar los datos actualizados en el archivo record.json


    res.status(200).json(patient.record[recordIndex]);        // Responder con el registro actualizado
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ELIMINAR HORA ESPESIFICA DEL HISTORIAL
app.delete("/patients/:patientID/records/:recordID", async (req, res) => {
  try {

    const patientID = parseInt(req.params.patientID);        // Obtener el patientID y el recordID de los parámetros de la solicitud
    const recordID = parseInt(req.params.recordID);
    const data = await readData(dataRecordPath);        // Leer los datos del archivo record.json


    const patient = data.patient.find(p => p.patientID === patientID);        // Buscar al paciente por patientID
    if (!patient) {
      return res.status(404).json({ error: `No se encontró el paciente con ID ${patientID}` });
    }

    const recordIndex = patient.record.findIndex(r => r.id === recordID);        // Buscar el índice del registro específico por recordID
    if (recordIndex === -1) {
      return res.status(404).json({ error: `No se encontró el registro con ID ${recordID}` });
    }

    const deletedRecord = patient.record.splice(recordIndex, 1);        // Eliminar el registro del array de registros del paciente

    await writeData(dataRecordPath, data);       // Guardar los datos actualizados en el archivo record.json

    res.status(200).json(deletedRecord[0]);        // Responder con el registro eliminado
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Servidor en escucha
app.listen(3001, () => {
  console.log("Servidor funcionando en el puerto 3001");
});
