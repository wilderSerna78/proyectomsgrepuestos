import { Router } from "express";
import userRoutes from "./users.routes.js";
import rolesRoutes from "./roles.routes.js";
import statesRoles from "./states.routes.js";
import authRoutes from "./auth.routes.js";
import categoriesRoutes from "./categories.routes.js";
import productsRoutes from "./products.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/api/categories", categoriesRoutes);
router.use("/api/products", productsRoutes);
router.use("/api/roles", rolesRoutes);
router.use("/api/states", statesRoles);
router.use("/api/users", userRoutes);

export default router;
