import db from "../models/index.model.js";

const { Rol } = db;

// --------------------------------------------------------
// 1. CREAR ROL (POST /roles)
// --------------------------------------------------------
export const createRole = async (req, res) => {
  try {
    const { nombreRol, descripcion } = req.body;

    // Validación básica de entrada
    if (!nombreRol || !descripcion) {
      return res.status(400).json({
        error: "Datos incompletos.",
        details: "Se requieren 'nombreRol' y 'descripcion'.",
      });
    }

    const newRole = await Rol.create({ nombreRol, descripcion });

    res.status(201).json({
      message: "Rol creado exitosamente.",
      idRol: newRole.idRol,
      nombreRol: newRole.nombreRol,
      descripcion: newRole.descripcion,
    });
  } catch (error) {
    console.error("Error al crear rol:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "El nombre del rol ya existe.",
      });
    }

    res.status(500).json({
      error: error.message || "Error interno del servidor al crear el rol.",
    });
  }
};

// --------------------------------------------------------
// 2. OBTENER TODOS LOS ROLES (GET /roles)
// --------------------------------------------------------
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll({
      order: [["nombreRol", "ASC"]],
    });
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error al obtener roles:", error);
    res.status(500).json({
      error:
        error.message || "Error interno del servidor al obtener los roles.",
    });
  }
};

// --------------------------------------------------------
// 3. OBTENER ROL POR ID (GET /roles/:idRol)
// --------------------------------------------------------
export const getRoleById = async (req, res) => {
  try {
    const { idRol } = req.params;

    const roleIdNumber = parseInt(idRol);
    if (isNaN(roleIdNumber) || roleIdNumber <= 0) {
      return res.status(400).json({ error: "ID de rol inválido." });
    }

    const role = await Rol.findByPk(roleIdNumber);

    if (role) {
      res.status(200).json(role);
    } else {
      res.status(404).json({ error: `Rol con ID ${idRol} no encontrado.` });
    }
  } catch (error) {
    console.error(`Error al obtener rol ${req.params.idRol}:`, error);
    res.status(500).json({
      error: error.message || "Error interno del servidor al buscar el rol.",
    });
  }
};

// --------------------------------------------------------
// 4. ACTUALIZAR ROL (PATCH /roles/:idRol)
// --------------------------------------------------------
export const updateRole = async (req, res) => {
  try {
    const { idRol } = req.params;
    const data = req.body;

    const roleIdNumber = parseInt(idRol);
    if (isNaN(roleIdNumber) || roleIdNumber <= 0) {
      return res.status(400).json({
        error: "ID de rol inválido.",
      });
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        error: "No se proporcionaron datos para actualizar.",
      });
    }

    const role = await Rol.findByPk(roleIdNumber);

    if (!role) {
      return res.status(404).json({
        error: "Rol no encontrado.",
      });
    }

    await role.update(data);

    res.status(200).json({
      message: "Rol actualizado correctamente.",
      idRol: roleIdNumber,
      data: role,
    });
  } catch (error) {
    console.error(`Error al actualizar rol ${req.params.idRol}:`, error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "Conflicto de datos. El nombre del rol ya existe.",
      });
    }

    res.status(500).json({
      error:
        error.message || "Error interno del servidor al actualizar el rol.",
    });
  }
};

// --------------------------------------------------------
// 5. ELIMINAR ROL (DELETE /roles/:idRol)
// --------------------------------------------------------
export const deleteRole = async (req, res) => {
  try {
    const { idRol } = req.params;
    const roleIdNumber = parseInt(idRol);

    if (isNaN(roleIdNumber) || roleIdNumber <= 0) {
      return res.status(400).json({ error: "ID de rol inválido." });
    }

    const role = await Rol.findByPk(roleIdNumber);

    if (!role) {
      return res.status(404).json({
        error: `Rol con ID ${idRol} no encontrado.`,
      });
    }

    await role.destroy();

    res.status(204).send(); // 204 No Content para eliminación exitosa
  } catch (error) {
    console.error(`Error al eliminar rol ${req.params.idRol}:`, error);

    // Manejo de error de clave foránea
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({
        error:
          "No se puede eliminar el rol porque está asignado a uno o más usuarios.",
      });
    }

    res.status(500).json({
      error: error.message || "Error interno del servidor al eliminar el rol.",
    });
  }
};
