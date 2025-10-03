// src/controllers/user.controller.js
import * as UserModel from "../models/user.model.js";

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Buscar usuario por email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    res.status(500).json({ error: "Error al buscar usuario" });
  }
};

// Crear usuario
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
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: error.message }); // 👈 Mostrar el mensaje real
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    // 1. Validar ID y Body de manera más robusta
    const userId = req.params.idUsuario;
    const data = req.body;

    // Validación mejorada del ID
    if (!userId || userId.trim() === "") {
      return res.status(400).json({
        error: "Se requiere un ID de usuario válido.",
        details: "El ID está vacío o no fue proporcionado.",
      });
    }

    // Validación del ID como número (si es requerido)
    const userIdNumber = parseInt(userId);
    if (isNaN(userIdNumber) || userIdNumber <= 0) {
      return res.status(400).json({
        error: "Se requiere un ID de usuario válido.",
        details: "El ID debe ser un número positivo.",
      });
    }

    // Validación mejorada de los datos
    if (!data || typeof data !== "object") {
      return res.status(400).json({
        error: "Datos inválidos.",
        details:
          "El cuerpo de la solicitud debe contener un objeto JSON válido.",
      });
    }

    // Filtrar datos vacíos o undefined
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    if (Object.keys(filteredData).length === 0) {
      return res.status(400).json({
        error: "Datos insuficientes para actualizar.",
        details:
          "Todos los campos proporcionados están vacíos o no son válidos.",
      });
    }

    // 2. Llamada al modelo con datos filtrados
    const success = await UserModel.updateUser(userIdNumber, filteredData);

    if (success) {
      // 3. Respuesta exitosa
      return res.status(200).json({
        message: "Usuario actualizado correctamente.",
        userId: userIdNumber,
        updatedFields: Object.keys(filteredData),
      });
    } else {
      // 4. Usuario no encontrado o sin cambios
      return res.status(404).json({
        error: "Usuario no encontrado o no se realizaron cambios.",
        details:
          "Verifique que el usuario exista y que los datos sean diferentes a los actuales.",
      });
    }
  } catch (error) {
    // 5. Manejo de errores mejorado
    console.error(
      `Error al actualizar usuario ${req.params.idUsuario}:`,
      error
    );

    // Manejar diferentes tipos de errores
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "Conflicto de datos.",
        details: "El email u otro campo único ya existe en el sistema.",
      });
    }

    if (error.code === "ER_NO_REFERENCED_ROW") {
      return res.status(400).json({
        error: "Referencia inválida.",
        details: "Alguna referencia en los datos no existe en el sistema.",
      });
    }

    return res.status(500).json({
      error: "Error interno del servidor al actualizar el usuario.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserModel.deleteUser(id);
    if (!deleted) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
