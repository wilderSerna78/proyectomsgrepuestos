// src/routes/orders.routes.js
import express from 'express';
import {
  checkout,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrder,
  deleteOrder
} from '../controllers/order.controllers.js';

// Importar middleware de autenticación (ya existente)
import { authMiddleware } from '../middlewares/auth.middleware.js';

// Importar middleware de roles (Nuevo)
import { isGestion, isGestionOrCliente } from '../middlewares/role.middleware.js'; // 👈 RUTA CORRECTA

const router = express.Router();

// ============================================================================
// Rutas de Checkout (Solo clientes)
// ============================================================================

/**
 * POST /api/orders/checkout
 * Procesar el checkout y crear una orden desde el carrito
 * Requiere autenticación
 */
// Nota: La función checkout ya tiene la lógica de rol, pero es buena práctica proteger la ruta.
router.post('/checkout', authMiddleware, checkout); 

// ============================================================================
// Rutas de Órdenes (CRUD)
// ============================================================================

/**
 * POST /api/orders
 * Crear una orden manualmente (Solo Gestión/Admin)
 */
router.post('/', authMiddleware, isGestion, createOrder);

/**
 * GET /api/orders
 * Obtener todas las órdenes (Solo Gestión/Admin)
 */
router.get('/', authMiddleware, isGestion, getAllOrders);

/**
 * GET /api/orders/:id
 * Obtener una orden específica por ID. 
 * El controlador getOrderById contiene la lógica para permitir al Cliente ver solo SU orden.
 */
router.get('/:id', authMiddleware, getOrderById);

/**
 * GET /api/orders/user/:idUsuario
 * Obtener todas las órdenes de un usuario. 
 * El controlador getOrdersByUser siempre usa el ID del TOKEN, no el del URL, por seguridad.
 */
// Nota: La ruta debe ser accedida por todos los autenticados, pero el controlador restringe la búsqueda a req.user.idUsuario.
// Cambiamos la ruta para que no espere un parámetro, haciendo que la llamada sea GET /api/orders/my-orders
router.get('/my-orders', authMiddleware, getOrdersByUser);


/**
 * PUT /api/orders/:id
 * Actualizar una orden (Solo Gestión/Admin)
 */
router.put('/:id', authMiddleware, isGestion, updateOrder);

/**
 * DELETE /api/orders/:id
 * Eliminar una orden (Solo Gestión/Admin)
 */
router.delete('/:id', authMiddleware, isGestion, deleteOrder);

export default router;



// // src/routes/orders.routes.js
// import { Router } from "express";
// import {
//   createOrder,
//   getOrderById,
//   getOrdersByUser,
//   getAllOrders,
//   updateOrder,
//   deleteOrder,
// } from "../controllers/order.controllers.js";

// const router = Router();

// /* ============================================================
//    📌 RUTAS PARA ÓRDENES
//    ------------------------------------------------------------
//    Base: /api/orders
//    ============================================================ */

// // Crear una nueva orden
// router.post("/", createOrder);

// // Obtener todas las órdenes
// router.get("/", getAllOrders);

// // Obtener todas las órdenes de un usuario (ruta más específica primero)
// router.get("/user/:idUsuario", getOrdersByUser);

// // Obtener una orden por ID
// router.get("/:id", getOrderById);

// // Actualizar una orden (ej: estado)
// router.put("/:id", updateOrder);

// // Eliminar una orden
// router.delete("/:id", deleteOrder);

// export default router;
