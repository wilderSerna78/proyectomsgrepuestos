// src/routes/orders.routes.js
import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controllers.js";

const router = Router();

/* ============================================================
   📌 RUTAS PARA ÓRDENES
   ------------------------------------------------------------
   Base: /api/orders
   ============================================================ */

// Crear una nueva orden
router.post("/", createOrder);

// Obtener todas las órdenes
router.get("/", getAllOrders);

// Obtener todas las órdenes de un usuario (ruta más específica primero)
router.get("/user/:idUsuario", getOrdersByUser);

// Obtener una orden por ID
router.get("/:id", getOrderById);

// Actualizar una orden (ej: estado)
router.put("/:id", updateOrder);

// Eliminar una orden
router.delete("/:id", deleteOrder);

export default router;


// // src/routes/orders.routes.js
// import { Router } from "express";
// import {
//   createOrder,
//   getAllOrders,
//   getOrderById,
//   updateOrder,
//   deleteOrder,
// } from "../controllers/orden.controllers.js";

// const router = Router();

// /* ============================================================
//    📌 RUTAS PARA ÓRDENES
//    ------------------------------------------------------------
//    Base: /api/v1/orders
//    ============================================================ */

// // Crear una nueva orden
// router.post("/", createOrder);

// // Obtener todas las órdenes
// router.get("/", getAllOrders);

// // Obtener una orden por ID
// router.get("/:id", getOrderById);

// // Actualizar una orden por ID
// router.put("/:id", updateOrder);

// // Eliminar una orden por ID
// router.delete("/:id", deleteOrder);

// export default router;
