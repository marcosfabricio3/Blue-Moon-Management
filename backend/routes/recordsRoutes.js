// routes/recordsRoutes.js
import express from 'express';
import {
  getAllRecords,
  getRecordsByPatientID,
  createRecord,
  updateRecord,
  deleteRecord,
  deletePatientRecords,
} from '../controllers/recordsController.js';

const router = express.Router();

// Obtener todos los datos en registros
router.get('/', getAllRecords);

// Obtener solo los datos de un paciente determinado
router.get('/:id/patient', getRecordsByPatientID);

// Crear un nuevo registro
router.post('/:id/patient', createRecord);

// Actualizar un registro existente
router.put('/:id', updateRecord);

// Eliminar un registro existente
router.delete('/:id', deleteRecord);

// Eliminar un paciernte y sus registros
router.delete('/:id/patient', deletePatientRecords);

export default router;
