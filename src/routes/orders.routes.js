// src/routes/orders.routes.js
import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByUser,
  // si luego implementas estas funciones en el controlador, las puedes agregar:
  // getAllOrders,
  // updateOrder,
  // deleteOrder,
} from "../controllers/order.controllers.js";

const router = Router();

/* ============================================================
   📌 RUTAS PARA ÓRDENES
   ------------------------------------------------------------
   Base: /api/v1/orders
   ============================================================ */

// Crear una nueva orden
router.post("/", createOrder);

// Obtener una orden por ID
router.get("/:id", getOrderById);

// Obtener todas las órdenes de un usuario
router.get("/user/:idUsuario", getOrdersByUser);

// Si más adelante implementas estas funciones en el controlador:
// router.get("/", getAllOrders);
// router.put("/:id", updateOrder);
// router.delete("/:id", deleteOrder);

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
