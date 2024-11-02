// controllers/patientsController.js
import { readData, writeData } from '../utils/fileHandler.js';
import path from 'path';

const patientsPath = path.join(process.cwd(), "data", "dataUsers.json");
const recordsPath = path.join(process.cwd(), "data", "record.json");

export const getAllPatients = async (req, res) => {
  try {
    const data = await readData(patientsPath);
    res.status(200).json(data.patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSpecificPatients = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await readData(patientsPath);
    const patient = data.patients.find(patient => patient.id === Number(id)); // Convertimos id a número

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPatient = async (req, res) => {
  const newPatient = req.body;

  try {
    const data = await readData(patientsPath);

    // Encontrar el id más alto en la lista de pacientes y sumar 1 para el nuevo id
    const maxId = data.patients.reduce((max, patient) => Math.max(max, patient.id), 0);
    newPatient.id = maxId + 1;

    data.patients.push(newPatient);
    await writeData(patientsPath, data);

       // Crear un registro vacío en recordsPath para el nuevo paciente
       const recordsData = await readData(recordsPath);
       const newRecord = {
         id: newPatient.id,         // El mismo ID del paciente
         patientID: newPatient.id,  // Referencia al ID del paciente en recordsPath
         record: []                 // Array vacío de registros
       };

           // Agregar el nuevo registro al archivo de registros
    recordsData.patient.push(newRecord);
    await writeData(recordsPath, recordsData);

    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePatient = async (req, res) => {
  const { id } = req.params;
  const updatedPatient = req.body;

  try {
    const data = await readData(patientsPath);
    
    // Convertimos `id` a número para asegurar una comparación correcta
    const index = data.patients.findIndex(patient => patient.id === Number(id));

    if (index === -1) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Actualizamos el paciente en la posición `index`
    data.patients[index] = { ...data.patients[index], ...updatedPatient };
    await writeData(patientsPath, data);
    res.status(200).json(data.patients[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePatient = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await readData(patientsPath);
    const index = data.patients.findIndex(patient => patient.id === Number(id));

    if (index === -1) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const deletedPatient = data.patients.splice(index, 1);
    await writeData(patientsPath, data);
    res.status(200).json(deletedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
