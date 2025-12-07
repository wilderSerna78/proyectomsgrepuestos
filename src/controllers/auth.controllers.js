// src/controllers/auth.controllers.js
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.utils.js";
import { connectMySQL } from "../config/mysql.config.js";
import { ensureCartExists } from "../utils/cart.utils.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  let connection;
  try {
    connection = await connectMySQL();

    const emailNormalizado = (email || "").trim().toLowerCase();

    // 1. Verificar usuario
    const [rows] = await connection.query(
      "SELECT idUsuario, nombre, email, password, idRol, idEstado FROM usuario WHERE email = ?",
      [emailNormalizado]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = rows[0];

    if (!user.password) {
      return res.status(500).json({ error: "Contraseña no configurada en BD" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // 2. Asegurar existencia del carrito
    const idCarrito = await ensureCartExists(user.idUsuario);

    // 3. Generar token con idCarrito
    const token = generateToken({
      idUsuario: user.idUsuario,
      nombre: user.nombre,
      email: user.email,
      idRol: user.idRol,
      idEstado: user.idEstado,
      idCarrito,
    });

    // 4. Configurar cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ seguro en producción
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    // 5. Respuesta al cliente
    return res.json({
      message: "Inicio de sesión exitoso",
      user: {
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        email: user.email,
        idRol: user.idRol,
        idEstado: user.idEstado,
      },
      idCarrito,
      token,
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    return res.status(500).json({ error: "Error interno en el servidor" });
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (e) {
        console.error("Error cerrando conexión:", e);
      }
    }
  }
};


// import bcrypt from "bcrypt";
// import { generateToken } from "../utils/jwt.utils.js";
// import { connectMySQL } from "../config/mysql.config.js";

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   let connection;
//   try {
//     connection = await connectMySQL();

//     const emailNormalizado = email.trim().toLowerCase();

//     const [rows] = await connection.query(
//       "SELECT * FROM usuario WHERE email = ?",
//       [emailNormalizado]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ error: "Usuario no encontrado" });
//     }

//     const user = rows[0];

//     if (!user.password) {
//       return res.status(500).json({ error: "Contraseña no configurada en BD" });
//     }

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.status(401).json({ error: "Datos incorrectos" });
//     }

//     const token = generateToken({
//       idUsuario: user.idUsuario,
//       nombre: user.nombre,
//       email: user.email,
//       idRol: user.idRol,
//       idEstado: user.idEstado,
//     });

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "strict",
//       maxAge: 60 * 60 * 1000,
//     });

//     return res.json({
//       message: "Inicio de sesión exitoso",
//       user: {
//         idUsuario: user.idUsuario,
//         nombre: user.nombre,
//         email: user.email,
//         idRol: user.idRol,
//         idEstado: user.idEstado,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error("❌ Error en login:", error.message);
//     return res.status(500).json({ error: error.message });
//   } finally {
//     if (connection) await connection.end();
//   }
// };
