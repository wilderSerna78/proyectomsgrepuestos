// src/middlewares/auth.middleware.js

import { verifyToken } from "../utils/jwt.utils.js";

export const authMiddleware = (req, res, next) => {
    // 💡 AÑADIDO: Log para verificar que la solicitud llega a este middleware
    console.log(`[DEBUG AUTH] Recibida solicitud para: ${req.method} ${req.path}`);
    
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];

    if (!authHeader) {
        // 💡 Log cuando el token no es proporcionado
        console.log(`[AUTH FAIL] ${req.path}: Token no proporcionado.`);
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    if (!authHeader.startsWith("Bearer ")) {
        // 💡 Log cuando el formato es inválido
        console.log(`[AUTH FAIL] ${req.path}: Formato de autorización inválido.`);
        return res.status(400).json({ error: "Formato de autorización inválido" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // datos del usuario en la request
        // 💡 Log de éxito
        console.log(`[AUTH SUCCESS] ${req.path}: Usuario ${decoded.idUsuario} autenticado.`);
        next();
    } catch (err) {
        // 💡 Log en caso de fallo de verificación del token
        console.log(`[AUTH FAIL] ${req.path}: Token inválido/expirado. Detalle: ${err.message}`);
        return res.status(403).json({ error: "Token inválido o expirado", details: err.message });
    }
};

// import { verifyToken } from "../utils/jwt.utils.js";

// export const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers["authorization"] || req.headers["Authorization"];

//   if (!authHeader) {
//     return res.status(401).json({ error: "Token no proporcionado" });
//   }

//   if (!authHeader.startsWith("Bearer ")) {
//     return res.status(400).json({ error: "Formato de autorización inválido" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = verifyToken(token);
//     req.user = decoded; // datos del usuario en la request
//     next();
//   } catch (err) {
//     return res.status(403).json({ error: "Token inválido o expirado", details: err.message });
//   }
// };

