import { Router } from "express";
import userRoutes from "./users.routes.js";

const router = Router();

router.use("/users", userRoutes);

export default router;
