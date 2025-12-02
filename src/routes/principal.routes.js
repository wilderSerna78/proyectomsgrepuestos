import { Router } from "express";
import userRoutes from "./users.routes.js";
import rolesRoutes from "./roles.routes.js";
import statesRoles from "./states.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/roles", rolesRoutes);
router.use("/states", statesRoles);
router.use("/auth", authRoutes);

export default router;
