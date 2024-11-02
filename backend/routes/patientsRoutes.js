// routes/patientsRoutes.js
import express from 'express';
import {getAllPatients,getSpecificPatients,createPatient,updatePatient,deletePatient,} from '../controllers/patientsController.js';

const router = express.Router();

// Obtener todos los pacientes
router.get('/', getAllPatients);

// Obtener paciente espesifico
router.get('/:id', getSpecificPatients);

// Crear un nuevo paciente
router.post('/', createPatient);

// Actualizar un paciente existente
router.put('/:id', updatePatient);

// Eliminar un paciente existente
router.delete('/:id', deletePatient);

export default router;
