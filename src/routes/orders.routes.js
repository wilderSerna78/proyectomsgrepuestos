// src/routes/orders.routes.js
import express from "express";
import {
  checkout,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controllers.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  isGestion,
  isGestionOrCliente,
} from "../middlewares/role.middleware.js";

const router = express.Router();

// Checkout
router.post("/checkout", authMiddleware, isGestionOrCliente, checkout);

// CRUD de Órdenes
router.post("/", authMiddleware, isGestionOrCliente, createOrder);

router.get("/", authMiddleware, isGestion, getAllOrders);

router.get("/:id", authMiddleware, getOrderById);

router.get("/my-orders", authMiddleware, getOrdersByUser);

router.put("/:id", authMiddleware, isGestion, updateOrder);

router.delete("/:id", authMiddleware, isGestion, deleteOrder);

export default router;



// // src/routes/orders.routes.js
// import express from "express";
// import {
//   checkout,
//   createOrder,
//   getAllOrders,
//   getOrderById,
//   getOrdersByUser,
//   updateOrder,
//   deleteOrder,
// } from "../controllers/order.controllers.js";

// import { authMiddleware } from "../middlewares/auth.middleware.js";
// // ⚠️ Nota: isGestionOrCliente ahora será usado para permitir a los clientes crear órdenes
// import {
//   isGestion,
//   isGestionOrCliente,
// } from "../middlewares/role.middleware.js";

// const router = express.Router();

// // ============================================================================
// // Rutas de Checkout (DEPRECADA, usar POST /api/orders)
// // ============================================================================

// /**
//  * POST /api/orders/checkout
//  * Procesar el checkout y crear una orden desde el carrito.
//  * Se recomienda usar POST /api/orders si se unifica la lógica.
//  */
// // Se mantiene por si es usada, pero protegida correctamente:
// router.post("/checkout", authMiddleware, isGestionOrCliente, checkout);

// // ============================================================================
// // Rutas de Órdenes (CRUD)
// // ============================================================================

// /**
//  * POST /api/orders
//  * Crear una orden (Esta debe ser accesible por Clientes para finalizar su compra)
//  */
// // 🔑 CORRECCIÓN CLAVE: Usamos isGestionOrCliente para que el Cliente pueda crear la orden.
// router.post("/", authMiddleware, isGestionOrCliente, createOrder);

// /**
//  * GET /api/orders
//  * Obtener todas las órdenes (Solo Gestión/Admin)
//  */
// router.get("/", authMiddleware, isGestion, getAllOrders);

// /**
//  * GET /api/orders/:id
//  * Obtener una orden específica por ID.
//  * El controlador getOrderById debe contener la lógica para permitir al Cliente ver solo SU orden.
//  * El acceso se permite a todos los autenticados para que el controlador valide el ID.
//  */
// router.get("/:id", authMiddleware, getOrderById);

// /**
//  * GET /api/orders/my-orders
//  * Obtener todas las órdenes del usuario autenticado (usando el ID del TOKEN).
//  */
// router.get("/my-orders", authMiddleware, getOrdersByUser);

// /**
//  * PUT /api/orders/:id
//  * Actualizar una orden (Solo Gestión/Admin)
//  */
// router.put("/:id", authMiddleware, isGestion, updateOrder);

// /**
//  * DELETE /api/orders/:id
//  * Eliminar una orden (Solo Gestión/Admin)
//  */
// router.delete("/:id", authMiddleware, isGestion, deleteOrder);

// export default router;

