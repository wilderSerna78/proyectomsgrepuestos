// src/routes/orderItems.routes.js
import { Router } from "express";
import {
  addItemToOrder,
  getItemsByOrder,
  updateItemInOrder,
  deleteItemFromOrder,
} from "../controller/orderItems.controllers.js";

const router = Router();

/* ============================================================
   📌 RUTAS PARA ITEMS DE ÓRDENES
   ------------------------------------------------------------
   Base: /api/v1/order-items
   ============================================================ */

// Agregar item a una orden
router.post("/", addItemToOrder);

// Obtener items de una orden específica
router.get("/order/:idOrden", getItemsByOrder);

// Actualizar un item dentro de una orden
router.put("/:idItem", updateItemInOrder);

// Eliminar un item de una orden
router.delete("/:idItem", deleteItemFromOrder);

export default router;
