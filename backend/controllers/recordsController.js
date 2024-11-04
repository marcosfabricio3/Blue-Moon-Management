import { readData, writeData } from "../utils/fileHandler.js";
import path from "path";

const recordsPath = path.join(process.cwd(), "data", "record.json");

// obtener todos los registros
export const getAllRecords = async (req, res) => {
  try {
    const data = await readData(recordsPath);
    res.status(200).json(data.patient);
  } catch (error) {
    W;
    res.status(500).json({ error: error.message });
    S;
  }
};

// obtener solo los datos de un paciente determinado
export const getRecordsByPatientID = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await readData(recordsPath);
    const patient = data.patient.find((patient) => patient.id === parseInt(id));
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient.record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// crear un nuevo registro
export const createRecord = async (req, res) => {
  const { id } = req.params;
  const { date, hour, attendance } = req.body;
  try {
    const data = await readData(recordsPath);
    const idInt = parseInt(id);
    const patientIndex = data.patient.findIndex(
      (patient) => patient.id === idInt
    );
    if (patientIndex === -1) {
      return res.status(404).json({ message: "Patient not found" });
    }
    let maxId = 0;
    data.patient.forEach((patient) => {
      patient.record.forEach((record) => {
        if (record.id > maxId) {
          maxId = record.id;
        }
      });
    });
    const newRecordId = maxId + 1;
    const newRecord = {
      id: newRecordId,
      date,
      hour,
      attendance,
    };
    data.patient[patientIndex].record.push(newRecord);
    await writeData(recordsPath, data);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// actualizar un registro existente
export const updateRecord = async (req, res) => {
  const { id } = req.params;
  const updatedRecord = req.body;
  try {
    const data = await readData(recordsPath);
    const recordId = parseInt(id);
    let recordFound = false;
    for (const patient of data.patient) {
      const recordIndex = patient.record.findIndex(
        (record) => record.id === recordId
      );
      if (recordIndex !== -1) {
        patient.record[recordIndex] = {
          ...patient.record[recordIndex],
          ...updatedRecord,
        };
        recordFound = true;
        break;
      }
    }
    if (!recordFound) {
      return res.status(404).json({ message: "Record not found" });
    }
    await writeData(recordsPath, data);
    res.status(200).json({ message: "Record updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// eliminar un registro espesifico
export const deleteRecord = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await readData(recordsPath);
    const recordId = parseInt(id);
    let recordFound = false;
    for (const patient of data.patient) {
      const recordIndex = patient.record.findIndex(
        (record) => record.id === recordId
      );
      if (recordIndex !== -1) {
        patient.record.splice(recordIndex, 1);
        recordFound = true;
        break;
      }
    }
    if (!recordFound) {
      return res.status(404).json({ message: "Record not found" });
    }
    await writeData(recordsPath, data);
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// eliminar un paciernte y sus registros
export const deletePatientRecords = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await readData(recordsPath);
    const patientIndex = data.patient.findIndex(
      (patient) => patient.id === parseInt(id)
    );
    if (patientIndex === -1) {
      return res.status(404).json({ message: "Patient not found" });
    }
    data.patient.splice(patientIndex, 1);
    await writeData(recordsPath, data);
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};