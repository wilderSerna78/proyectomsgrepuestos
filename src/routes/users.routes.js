// src/routes/users.routes.js
import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
} from "../controllers/users.controllers.js";

const router = express.Router();

// ✅ Listar todos los usuarios
router.get("/", getAllUsers);

// ✅ Buscar usuario por ID
router.get("/:id", getUserById);

// ✅ Buscar usuario por email
router.get("/email/:email", getUserByEmail);

// ✅ Crear un nuevo usuario
router.post("/", createUser);

// ✅ Actualizar un usuario
router.put("/:idUsuario", updateUser);

// ✅ Eliminar un usuario
router.delete("/:id", deleteUser);

export default router;
