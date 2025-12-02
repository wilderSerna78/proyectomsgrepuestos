import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.utils.js";
import { connectMySQL } from "../config/mysql.config.js";

export const login = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const connection = await connectMySQL();
    const [rows] = await connection.query(
      "SELECT * FROM usuario WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      await connection.end();
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = rows[0];

    // Comparar contraseñas
    const validPassword = await bcrypt.compare(contrasena, user.contrasena);
    if (!validPassword) {
      await connection.end();
      return res.status(401).json({ error: "Datos incorrectos" });
    }

    // Generar token JWT
    const token = generateToken({
      idUsuario: user.idUsuario,
      nombre: user.nombre,
      email: user.email,
      idRol: user.idRol,
      idEstado: user.idEstado,
    });

    // Guardar el token en una cookie segura
    res.cookie("token", token, {
      httpOnly: true, // No accesible por JS del cliente
      secure: false, // Cambia a true en producción (HTTPS)
      sameSite: "strict", // Evita envío en peticiones cruzadas
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    // Enviar respuesta al cliente
    res.json({
      message: "Inicio de sesión exitoso",
      user: {
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        email: user.email,
        idRol: user.idRol,
        idEstado: user.idEstado,
      },
      token, // opcional: lo envías también en el body
    });

    await connection.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
