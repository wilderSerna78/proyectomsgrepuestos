import bcrypt from "bcrypt";
import * as UserModel from "../models/user.model.js";

// ✅ Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID de usuario inválido." });
    }

    const user = await UserModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return res.status(500).json({ error: "Error al obtener usuario." });
  }
};

// ✅ Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    return res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return res.status(500).json({ error: "Error al obtener usuarios." });
  }
};

// ✅ Buscar usuario por email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email || typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({ error: "Email inválido." });
    }

    const user = await UserModel.getUserByEmail(email.trim().toLowerCase());
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    return res.status(500).json({ error: "Error al buscar usuario." });
  }
};

// ✅ Crear usuario con contraseña encriptada
export const createUser = async (req, res) => {
  try {
    const { nombre, email, contrasena, idEstado, idRol } = req.body;

    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const newUser = await UserModel.createUser(
      nombre,
      email.toLowerCase(),
      hashedPassword,
      idEstado,
      idRol
    );

    return res.status(201).json({ data: newUser });
  } catch (error) {
    console.error("Error al crear usuario:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El email ya está registrado." });
    }

    return res.status(500).json({ error: "Error al crear usuario." });
  }
};

// ✅ Actualizar usuario (encripta contraseña si se envía)
export const updateUser = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const data = req.body;

    if (!idUsuario || isNaN(idUsuario)) {
      return res.status(400).json({ error: "ID de usuario inválido." });
    }

    if (!data || typeof data !== "object") {
      return res.status(400).json({ error: "Datos inválidos." });
    }

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    if (Object.keys(filteredData).length === 0) {
      return res
        .status(400)
        .json({ error: "Datos insuficientes para actualizar." });
    }

    if (filteredData.contrasena) {
      filteredData.contrasena = await bcrypt.hash(filteredData.contrasena, 10);
    }

    const success = await UserModel.updateUser(
      parseInt(idUsuario),
      filteredData
    );

    if (!success) {
      return res
        .status(404)
        .json({ error: "Usuario no encontrado o sin cambios." });
    }

    return res.status(200).json({
      data: {
        message: "Usuario actualizado correctamente.",
        userId: parseInt(idUsuario),
        updatedFields: Object.keys(filteredData),
      },
    });
  } catch (error) {
    console.error(
      `Error al actualizar usuario ${req.params.idUsuario}:`,
      error
    );

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Campo duplicado." });
    }

    if (error.code === "ER_NO_REFERENCED_ROW") {
      return res.status(400).json({ error: "Referencia inválida." });
    }

    return res
      .status(500)
      .json({ error: "Error interno al actualizar usuario." });
  }
};

// ✅ Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID de usuario inválido." });
    }

    const deleted = await UserModel.deleteUser(parseInt(id));

    if (!deleted) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    return res
      .status(200)
      .json({ data: { message: "Usuario eliminado correctamente." } });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res
      .status(500)
      .json({ error: "Error interno al eliminar usuario." });
  }
};

// ✅ Login de usuario (comparar hash)
export const loginUser = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son requeridos." });
    }

    const user = await UserModel.getUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contraseña incorrecta." });
    }

    return res.status(200).json({
      data: {
        message: "Inicio de sesión exitoso.",
        user: {
          idUsuario: user.idUsuario,
          nombre: user.nombre,
          email: user.email,
          idRol: user.idRol,
          idEstado: user.idEstado,
        },
      },
    });
  } catch (error) {
    console.error("Error en loginUser:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};
