import express from "express";
import {
  createCart, // 💡 NUEVA IMPORTACIÓN
  getAllCarts,
  getCartById,
  addProductToCart,
  deleteItemFromCart,
  emptyCart,
} from "../controllers/carts.controllers.js"; // Asegúrate de que getAllCarts esté exportado en este archivo
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ============================================================
   📌 RUTAS PARA CARRITO
   Base: /api/carts
   ============================================================ */

// Crear un nuevo carrito (solo autenticado)
router.post("/", authMiddleware, createCart);

// 💡 NUEVA RUTA: Obtener TODOS los carritos (Ideal para administradores)
// NOTA: Esta debe ir ANTES de la ruta con :id
router.get("/", authMiddleware, getAllCarts);

// Obtener carrito por ID (solo autenticado)
router.get("/:id", authMiddleware, getCartById);

// Agregar producto al carrito (solo autenticado)
router.post("/add", authMiddleware, addProductToCart);

// Eliminar producto específico del carrito (por idItemCarrito)
router.delete("/item/:idItemCarrito", authMiddleware, deleteItemFromCart);

// Vaciar carrito completo (por idCarrito)
router.delete("/empty/:idCarrito", authMiddleware, emptyCart);

export default router;

// import express from "express";
// import {
//   createCart,
//   getCartById,
//   addProductToCart,
//   deleteItemFromCart,
//   emptyCart,
// } from "../controllers/carts.controllers.js";
// import { authMiddleware } from "../middlewares/auth.middleware.js";

// const router = express.Router();

// /* ============================================================
//    📌 RUTAS PARA CARRITO
//    Base: /api/carts
//    ============================================================ */

// // Crear un nuevo carrito (solo autenticado)
// router.post("/", authMiddleware, createCart);

// // Obtener carrito por ID (solo autenticado)
// router.get("/:id", authMiddleware, getCartById);

// // Agregar producto al carrito (solo autenticado)
// router.post("/add", authMiddleware, addProductToCart);

// // Eliminar producto específico del carrito (por idItemCarrito)
// router.delete("/item/:idItemCarrito", authMiddleware, deleteItemFromCart);

// // Vaciar carrito completo (por idCarrito)
// router.delete("/empty/:idCarrito", authMiddleware, emptyCart);

// export default router;
