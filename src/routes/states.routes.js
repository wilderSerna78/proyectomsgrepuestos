import express from "express";
// ⚠️ Asegúrate que la ruta al controlador sea correcta
import { 
    createState,
    getAllStates,
    getStateById,
    updateState,
    deleteState
} from '../controller/states.controllers.js'; 

const router = express.Router();

// =======================================================
// RUTAS PRINCIPALES: /api/estados (o /api/states)
// =======================================================

// POST /api/estados
// Crea un nuevo estado.
router.post('/', createState);

// GET /api/estados
// Obtiene todos los estados.
router.get('/', getAllStates);


// =======================================================
// RUTAS ESPECÍFICAS POR ID: /api/estados/:idEstado
// =======================================================

// GET /api/estados/:idEstado
// Obtiene un estado por su ID.
router.get('/:idEstado', getStateById);

// PATCH /api/estados/:idEstado
// Actualiza un estado parcialmente.
router.put('/:idEstado', updateState);

// DELETE /api/estados/:idEstado
// Elimina un estado por su ID.
router.delete('/:idEstado', deleteState);


export default router;