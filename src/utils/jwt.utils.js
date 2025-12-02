// src/utils/jwt.utils.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * ✅ Generar un token JWT
 * @param {Object} payload - Datos que se incluirán en el token (ej: idUsuario, email)
 * @returns {string} Token JWT firmado
 */
export const generateToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || "1h", // tiempo por defecto 1 hora
    });
  } catch (error) {
    console.error("❌ Error generando token:", error.message);
    return null;
  }
};

/**
 * ✅ Verificar y decodificar un token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {Object|null} Datos decodificados o null si es inválido/expirado
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("⚠️ Token inválido o expirado:", error.message);
    return null;
  }
};



// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

// // ✅ Generar token
// export const generateToken = (payload) => {
//   return jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES,
//   });
// };

// // ✅ Verificar token
// export const verifyToken = (token) => {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET);
//   } catch (error) {
//     return null;
//   }
// };


