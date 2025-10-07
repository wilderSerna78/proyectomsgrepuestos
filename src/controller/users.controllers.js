// src/controllers/user.controller.js
import * as UserModel from "../models/user.model.js";

// ✅ Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ data: user }); // ✅ Envuelve en { data }
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// ✅ Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json({ data: users }); // ✅ Envuelve en { data }
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// ✅ Buscar usuario por email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ data: user }); // ✅ Envuelve en { data }
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    res.status(500).json({ error: "Error al buscar usuario" });
  }
};

// ✅ Crear usuario
export const createUser = async (req, res) => {
  try {
    const { nombre, email, contrasena, idEstado, idRol } = req.body;

    const newUser = await UserModel.createUser(
      nombre,
      email,
      contrasena,
      idEstado,
      idRol
    );

    res.status(201).json({ data: newUser }); // ✅ Envuelve en { data }
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.idUsuario;
    const data = req.body;

    if (!userId || userId.trim() === "") {
      return res.status(400).json({
        error: "Se requiere un ID de usuario válido.",
      });
    }

    const userIdNumber = parseInt(userId);
    if (isNaN(userIdNumber) || userIdNumber <= 0) {
      return res.status(400).json({
        error: "El ID debe ser un número positivo.",
      });
    }

    if (!data || typeof data !== "object") {
      return res.status(400).json({
        error: "Datos inválidos. Se requiere un objeto JSON válido.",
      });
    }

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    if (Object.keys(filteredData).length === 0) {
      return res.status(400).json({
        error: "Datos insuficientes para actualizar.",
      });
    }

    const success = await UserModel.updateUser(userIdNumber, filteredData);

    if (success) {
      return res.status(200).json({
        data: {
          message: "Usuario actualizado correctamente.",
          userId: userIdNumber,
          updatedFields: Object.keys(filteredData),
        },
      });
    } else {
      return res.status(404).json({
        error: "Usuario no encontrado o no se realizaron cambios.",
      });
    }
  } catch (error) {
    console.error(
      `Error al actualizar usuario ${req.params.idUsuario}:`,
      error
    );

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "Conflicto de datos: campo duplicado.",
      });
    }

    if (error.code === "ER_NO_REFERENCED_ROW") {
      return res.status(400).json({
        error: "Referencia inválida: datos no existen.",
      });
    }

    res.status(500).json({
      error: "Error interno del servidor al actualizar el usuario.",
    });
  }
};

// ✅ Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserModel.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ data: { message: "Usuario eliminado correctamente" } }); // ✅ Envuelve en { data }
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
