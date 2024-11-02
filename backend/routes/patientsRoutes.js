import express from "express";
import {
  getAllPatients,
  getSpecificPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientsController.js";

const router = express.Router();

// obtener todos los pacientes
router.get("/", getAllPatients);

// obtener paciente espesifico
router.get("/:id", getSpecificPatients);

// crear un nuevo paciente
router.post("/", createPatient);

// actualizar un paciente existente
router.put("/:id", updatePatient);

// eliminar un paciente existente
router.delete("/:id", deletePatient);

export default router;