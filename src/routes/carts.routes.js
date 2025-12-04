import express from "express";
import {
    createCart,
    getCartById,
    addProductToCart,
    deleteItemFromCart,
    emptyCart
} from "../controller/carts.controllers.js";

const router = express.Router();

// Crear carrito
router.post("/", createCart);

// Obtener carrito por ID
router.get("/:id", getCartById);

// Agregar producto al carrito
router.post("/add-product", addProductToCart);

// Eliminar producto por idItemCarrito
router.delete("/item/:idItemCarrito", deleteItemFromCart);

// Vaciar el carrito completo
router.delete("/empty/:idCarrito", emptyCart);

export default router;
