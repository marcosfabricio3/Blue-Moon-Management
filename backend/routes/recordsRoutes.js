import express from "express";
import {
  getAllRecords,
  getRecordsByPatientID,
  createRecord,
  updateRecord,
  deleteRecord,
  deletePatientRecords,
} from "../controllers/recordsController.js";

const router = express.Router();

// obtener todos los registros
router.get("/", getAllRecords);

// obtener solo los datos de un paciente determinado
router.get("/:id/patient", getRecordsByPatientID);

// crear un nuevo registro
router.post("/:id/patient", createRecord);

// actualizar un registro existente
router.put("/:id", updateRecord);

// eliminar un registro espesifico
router.delete("/:id", deleteRecord);

// eliminar un paciernte y sus registros
router.delete("/:id/patient", deletePatientRecords);

export default router;