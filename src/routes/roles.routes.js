import express from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "../controllers/roles.controllers.js";

const router = express.Router();

// =======================================================
// RUTAS PRINCIPALES: /api/roles
// =======================================================

router.post("/", createRole);
router.get("/", getAllRoles);

// =======================================================
// RUTAS ESPECÍFICAS POR ID: /api/roles/:idRol
// =======================================================

router.get("/:idRol", getRoleById);

// ✅ SOLUCIÓN: Cambiar a PUT o agregar ambos métodos
router.put("/:idRol", updateRole); // Para PUT
router.patch("/:idRol", updateRole); // Para PATCH (opcional)

router.delete("/:idRol", deleteRole);

export default router;

// import express from 'express';
// // ⚠️ Asegúrate que la ruta al controlador sea correcta
// import {
//     createRole,
//     getAllRoles,
//     getRoleById,
//     updateRole,
//     deleteRole
// } from '../controller/roles.controllers.js';

// const router = express.Router();

// // =======================================================
// // RUTAS PRINCIPALES: /api/roles
// // =======================================================

// // POST /api/roles
// // Crea un nuevo rol.
// router.post('/', createRole);

// // GET /api/roles
// // Obtiene todos los roles.
// router.get('/', getAllRoles);

// // =======================================================
// // RUTAS ESPECÍFICAS POR ID: /api/roles/:idRol
// // =======================================================

// // GET /api/roles/:idRol
// // Obtiene un rol por su ID.
// router.get('/:idRol', getRoleById);

// // PATCH /api/roles/:idRol
// // Actualiza un rol parcialmente.
// router.patch('/:idRol', updateRole);

// // DELETE /api/roles/:idRol
// // Elimina un rol por su ID.
// router.delete('/:idRol', deleteRole);

// export default router;
