import { Router } from "express";
import userRoutes from "./users.routes.js";
import rolesRoutes from "./roles.routes.js";
import statesRoles from "./states.routes.js";
import authRoutes from "./auth.routes.js";
import cartsRoutes from "./carts.routes.js";
import categoriesRoutes from "./categories.routes.js";
import itemsCartRoutes from "./itemsCart.routes.js";
// import itemsOrderRoutes from "./itemsOrder.routes.js";
import orderItemsRoutes from "./orderItems.routes.js";
import ordersRoutes from "./orders.routes.js";
import productsRoutes from "./products.routes.js";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/carts", cartsRoutes);
router.use("/api/categories", categoriesRoutes);
router.use("/api/items-cart", itemsCartRoutes);
router.use("/api/items-order", orderItemsRoutes);
router.use("/api/orders", ordersRoutes);
router.use("/api/products", productsRoutes);
router.use("/api/roles", rolesRoutes);
router.use("/api/states", statesRoles);
router.use("/api/users", userRoutes);

export default router;
