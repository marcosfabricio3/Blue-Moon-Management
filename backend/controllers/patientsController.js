// controllers/patientsController.js
import { readData, writeData } from "../utils/fileHandler.js";
import path from "path";

const patientsPath = path.join(process.cwd(), "data", "dataUsers.json");
const recordsPath = path.join(process.cwd(), "data", "record.json");

// obtener todos los pacientes
export const getAllPatients = async (req, res) => {
  try {
    const data = await readData(patientsPath);
    res.status(200).json(data.patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// obtener paciente espesifico
export const getSpecificPatients = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await readData(patientsPath);
    const patient = data.patients.find((patient) => patient.id === Number(id));
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// crear un nuevo paciente
export const createPatient = async (req, res) => {
  const newPatient = req.body;
  try {
    const data = await readData(patientsPath);
    const maxId = data.patients.reduce(
      (max, patient) => Math.max(max, patient.id),
      0
    );
    newPatient.id = maxId + 1;
    data.patients.push(newPatient);
    await writeData(patientsPath, data);
    const recordsData = await readData(recordsPath);
    const newRecord = {
      id: newPatient.id,
      patientID: newPatient.id,
      record: [],
    };
    recordsData.patient.push(newRecord);
    await writeData(recordsPath, recordsData);
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// actualizar un paciente existente
export const updatePatient = async (req, res) => {
  const { id } = req.params;
  const updatedPatient = req.body;
  try {
    const data = await readData(patientsPath);
    const index = data.patients.findIndex(
      (patient) => patient.id === Number(id)
    );
    if (index === -1) {
      return res.status(404).json({ message: "Patient not found" });
    }
    data.patients[index] = { ...data.patients[index], ...updatedPatient };
    await writeData(patientsPath, data);
    res.status(200).json(data.patients[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// liminar un paciente existente
export const deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await readData(patientsPath);
    const index = data.patients.findIndex(
      (patient) => patient.id === Number(id)
    );
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