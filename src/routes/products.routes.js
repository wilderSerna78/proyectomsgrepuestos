// --- products.routes.js ---
import express from "express";
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "../controllers/products.controllers.js";

const router = express.Router();

/* ============================================================
   📌 RUTAS CRUD PARA PRODUCTOS
   ------------------------------------------------------------
   Base URL sugerida: /api/v1/products
   
   Cada ruta está organizada según la operación CRUD que realiza:
   - Listar productos
   - Obtener producto por ID
   - Crear producto
   - Actualizar producto
   - Eliminar producto
   ============================================================ */

/* ============================================================
   🟦 LISTAR / CONSULTAR PRODUCTOS
   ------------------------------------------------------------
   @route   GET /
   @desc    Obtiene todos los productos. Incluye soporte para
            filtros por query (ej: ?nombre=aceite&marca=Castrol).
   @access  Público
   ============================================================ */
router.get("/", getAllProductsController);

/* ============================================================
   🟩 CREAR PRODUCTO
   ------------------------------------------------------------
   @route   POST /
   @desc    Registra un nuevo producto en la base de datos.
   @access  Privado / Admin
   @note    Aquí pueden incluirse middlewares:
            - Validación de datos
            - Autenticación y rol de administrador
   ============================================================ */
router.post(
  "/",
  // Ejemplo de uso: validateProductData, authMiddleware, adminMiddleware
  createProductController
);

/* ============================================================
   🟨 CONSULTAR PRODUCTO POR ID
   ------------------------------------------------------------
   @route   GET /:id
   @desc    Obtiene la información de un único producto según su ID.
   @access  Público
   ============================================================ */
router.get("/:id", getProductByIdController);

/* ============================================================
   🟧 ACTUALIZAR PRODUCTO
   ------------------------------------------------------------
   @route   PUT /:id
   @desc    Modifica los datos de un producto existente.
   @access  Privado / Admin
   @note    Aquí pueden incluirse middlewares:
            - Autenticación (authMiddleware)
            - Verificación de rol admin (adminMiddleware)
            - Validación de datos (validateProductUpdate)
   ============================================================ */
router.put("/:id", updateProductController);

/* ============================================================
   🟥 ELIMINAR PRODUCTO
   ------------------------------------------------------------
   @route   DELETE /:id
   @desc    Elimina un producto de la base de datos.
   @access  Privado / Admin
   @note    Usualmente se verifica si el producto está siendo usado
            en otras tablas (ventas, inventarios, etc.).
   ============================================================ */
router.delete("/:id", deleteProductController);

export default router;
