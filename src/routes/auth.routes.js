import express from "express";
import { login } from "../controller/auth.controllers.js";

const router = express.Router();

// Ruta para iniciar sesión
router.post("/login", login);

export default router;
