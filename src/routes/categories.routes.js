// --- categories.routes.js ---
import express from "express";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/categories.controllers.js";

const router = express.Router();

// ============================================================
// 📌 RUTAS CRUD PARA CATEGORÍAS
// ============================================================

// RUTA DE LECTURA (LISTADO)
// GET /api/v1/categories
// Uso: Obtener la lista completa de categorías.
// Acceso: Público (para listar en el frontend)
router.get("/", getAllCategoriesController);

// RUTA DE CREACIÓN
// POST /api/v1/categories
// Uso: Crear una nueva categoría (ej: 'NUEVA CATEGORÍA')
// Acceso: Privado / Admin
router.post(
  "/",
  // NOTA: Aquí se incluiría el middleware de autenticación y rol de administrador
  createCategoryController
);

// RUTAS QUE REQUIEREN ID ESPECÍFICO (/:id)

// RUTA DE LECTURA INDIVIDUAL
// GET /api/v1/categories/1
router.get("/:id", getCategoryByIdController);

// RUTA DE ACTUALIZACIÓN
// PUT /api/v1/categories/1
// Uso: Modificar nombre o descripción de la categoría (ej: { "nombreCategoria": "Frenos ABS" })
// Acceso: Privado / Admin
router.put(
  "/:id",
  // NOTA: Aquí se incluiría el middleware de autenticación y rol
  updateCategoryController
);

// RUTA DE ELIMINACIÓN
// DELETE /api/v1/categories/1
// Uso: Eliminar una categoría
// Acceso: Privado / Admin
router.delete(
  "/:id",
  // NOTA: Aquí se incluiría el middleware de autenticación y rol
  deleteCategoryController
);

export default router;
