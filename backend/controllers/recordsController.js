// controllers/recordsController.js
import { readData, writeData } from '../utils/fileHandler.js';
import path from 'path';

const recordsPath = path.join(process.cwd(), "data", "record.json");

// Obtener todos los registros de todos los pacientes
export const getAllRecords = async (req, res) => {
  try {
    const data = await readData(recordsPath);
    res.status(200).json(data.patient);
  } catch (error) {W
    res.status(500).json({ error: error.message });S
  }
};

// Obtener todos los registros de un paciente específico por su patientID
export const getRecordsByPatientID = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await readData(recordsPath);

    // Buscar el paciente por su id
    const patient = data.patient.find(patient => patient.id === parseInt(id));

    // Verificar si el paciente existe
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Devolver los registros del paciente encontrado
    res.status(200).json(patient.record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Crear un nuevo record para un paciente existente
export const createRecord = async (req, res) => {
  const { id } = req.params; // Obtener id desde la URL
  const { date, hour, attendance } = req.body; // Obtener el resto de datos del cuerpo de la solicitud

  try {
    const data = await readData(recordsPath);

    // Convertir id a entero para evitar problemas de tipo
    const idInt = parseInt(id);
    const patientIndex = data.patient.findIndex(patient => patient.id === idInt);

    if (patientIndex === -1) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Buscar el máximo ID actual en todos los registros
    let maxId = 0;
    data.patient.forEach(patient => {
      patient.record.forEach(record => {
        if (record.id > maxId) {
          maxId = record.id;
        }
      });
    });

    // Asignar el nuevo ID incrementado en 1
    const newRecordId = maxId + 1;
    const newRecord = {
      id: newRecordId,
      date,
      hour,
      attendance
    };

    // Agregar el nuevo registro al array de registros del paciente
    data.patient[patientIndex].record.push(newRecord);

    // Guardar los cambios en el archivo JSON
    await writeData(recordsPath, data);

    // Responder con el registro creado
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un registro específico
export const updateRecord = async (req, res) => {
  const { id } = req.params; // Obtener el ID del registro desde la URL
  const updatedRecord = req.body; // Datos actualizados desde el cuerpo de la solicitud

  try {
    const data = await readData(recordsPath);

    // Convertir el ID a entero
    const recordId = parseInt(id);
    let recordFound = false;

    // Buscar y actualizar el registro por ID en todos los pacientes
    for (const patient of data.patient) {
      const recordIndex = patient.record.findIndex(record => record.id === recordId);

      if (recordIndex !== -1) {
        // Actualizar el registro con los datos proporcionados
        patient.record[recordIndex] = { ...patient.record[recordIndex], ...updatedRecord };
        recordFound = true;
        break; // Detener la búsqueda una vez que se ha encontrado el registro
      }
    }

    if (!recordFound) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Guardar los cambios en el archivo JSON
    await writeData(recordsPath, data);

    // Responder con el registro actualizado
    res.status(200).json({ message: "Record updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un registro específico
export const deleteRecord = async (req, res) => {
  const { id } = req.params; // Obtener el ID del registro desde la URL

  try {
    const data = await readData(recordsPath);

    // Convertir el ID a entero
    const recordId = parseInt(id);
    let recordFound = false;

    // Buscar y eliminar el registro por ID en todos los pacientes
    for (const patient of data.patient) {
      const recordIndex = patient.record.findIndex(record => record.id === recordId);

      if (recordIndex !== -1) {
        // Eliminar el registro
        patient.record.splice(recordIndex, 1);
        recordFound = true;
        break; // Detener la búsqueda una vez que se ha encontrado y eliminado el registro
      }
    }

    if (!recordFound) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Guardar los cambios en el archivo JSON
    await writeData(recordsPath, data);

    // Responder con un mensaje de éxito
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Borrar registros de paciente con el paciente en si mismo
export const deletePatientRecords = async (req, res) => {
  const { id } = req.params; // Obtener el id desde la URL

  try {
    const data = await readData(recordsPath);
    // Buscar el índice del paciente usando id
    const patientIndex = data.patient.findIndex(patient => patient.id === parseInt(id));

    if (patientIndex === -1) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Eliminar el paciente del array
    data.patient.splice(patientIndex, 1);

    // Guardar los cambios en el archivo JSON
    await writeData(recordsPath, data);

    // Responder con un mensaje de éxito
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

