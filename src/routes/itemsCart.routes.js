// src/routes/itemsCart.routes.js - Código Depurado

import express from "express";
import {
  getItemsByCart,
  addItemToCart,
  updateItemQuantity,
  deleteItem,
  clearCart,
} from "../controller/itemsCart.controllers.js";

const router = express.Router();

// ------------------------------------------------------------
// 📌 Obtener todos los items de un carrito
// GET /api/v1/items-cart/cart/:idCarrito
// ------------------------------------------------------------
router.get("/cart/:idCarrito", getItemsByCart);

// ------------------------------------------------------------
// 📌 Agregar un producto al carrito
// POST /api/v1/items-cart
// body: { idCarrito, idProducto, cantidad }
// ------------------------------------------------------------
router.post("/", addItemToCart);

// ------------------------------------------------------------
// 📌 Actualizar cantidad de un item
// PUT /api/v1/items-cart/:idItemCarrito  <-- 🛑 CORREGIDO
// ------------------------------------------------------------
router.put("/:idItemCarrito", updateItemQuantity);

// ------------------------------------------------------------
// 📌 Eliminar un item del carrito
// DELETE /api/v1/items-cart/:idItemCarrito <-- 🛑 CORREGIDO
// ------------------------------------------------------------
router.delete("/:idItemCarrito", deleteItem);

// ------------------------------------------------------------
// 📌 Vaciar el carrito completo
// DELETE /api/v1/items-cart/cart/:idCarrito
// ------------------------------------------------------------
router.delete("/cart/:idCarrito", clearCart);

export default router;

// // src/routes/itemsCart.routes.js


// import express from "express";
// import {
//   getItemsByCart,
//   addItemToCart,
//   updateItemQuantity,
//   deleteItem,
//   clearCart,
// } from "../controller/itemsCart.controllers.js";

// const router = express.Router();

// // ------------------------------------------------------------
// // 📌 Obtener todos los items de un carrito
// // GET /api/v1/items-cart/cart/:idCarrito
// // ------------------------------------------------------------
// router.get("/cart/:idCarrito", getItemsByCart);

// // ------------------------------------------------------------
// // 📌 Agregar un producto al carrito
// // POST /api/v1/items-cart
// // body: { idCarrito, idProducto, cantidad }
// // ------------------------------------------------------------
// router.post("/", addItemToCart);

// // ------------------------------------------------------------
// // 📌 Actualizar cantidad de un item
// // PUT /api/v1/items-cart/:idItem
// // ------------------------------------------------------------
// router.put("/:idItem", updateItemQuantity);

// // ------------------------------------------------------------
// // 📌 Eliminar un item del carrito
// // DELETE /api/v1/items-cart/:idItem
// // ------------------------------------------------------------
// router.delete("/:idItem", deleteItem);

// // ------------------------------------------------------------
// // 📌 Vaciar el carrito completo
// // DELETE /api/v1/items-cart/cart/:idCarrito
// // ------------------------------------------------------------
// router.delete("/cart/:idCarrito", clearCart);

// export default router;
