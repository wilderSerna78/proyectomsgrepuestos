import { verifyToken } from "../utils/jwt.utils.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }

  req.user = decoded; // Guarda los datos del usuario en la request
  next();
};
