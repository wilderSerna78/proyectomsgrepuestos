import { verifyToken } from "../utils/jwt.utils.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ error: "Formato de autorización inválido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // datos del usuario en la request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido o expirado", details: err.message });
  }
};


// import { verifyToken } from "../utils/jwt.utils.js";

// export const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ error: "Token no proporcionado" });
//   }

//   const token = authHeader.split(" ")[1]; // "Bearer <token>"
//   const decoded = verifyToken(token);

//   if (!decoded) {
//     return res.status(403).json({ error: "Token inválido o expirado" });
//   }

//   req.user = decoded; // Guarda los datos del usuario en la request
//   next();
// };
