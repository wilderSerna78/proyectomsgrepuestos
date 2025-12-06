import db from "../models/index.model.js";

const { Estado } = db;

// --------------------------------------------------------
// 1. CREAR ESTADO (POST /estados)
// --------------------------------------------------------
export const createState = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // Validación de datos de entrada
    if (!nombre || !descripcion) {
      return res.status(400).json({
        error: "Datos incompletos.",
        details: "Se requieren 'nombre' y 'descripcion' para crear el estado.",
      });
    }

    const newState = await Estado.create({ nombre, descripcion });

    res.status(201).json({
      message: "Estado creado exitosamente.",
      idEstado: newState.idEstado,
      nombre: newState.nombre,
      descripcion: newState.descripcion,
    });
  } catch (error) {
    console.error("Error al crear estado:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "El nombre del estado ya existe.",
      });
    }

    res.status(500).json({
      error: error.message || "Error interno del servidor al crear el estado.",
    });
  }
};

// --------------------------------------------------------
// 2. OBTENER TODOS LOS ESTADOS (GET /estados)
// --------------------------------------------------------
export const getAllStates = async (req, res) => {
  try {
    const states = await Estado.findAll({
      order: [["nombre", "ASC"]],
    });
    res.status(200).json(states);
  } catch (error) {
    console.error("Error al obtener estados:", error);
    res.status(500).json({
      error:
        error.message || "Error interno del servidor al obtener los estados.",
    });
  }
};

// --------------------------------------------------------
// 3. OBTENER ESTADO POR ID (GET /estados/:idEstado)
// --------------------------------------------------------
export const getStateById = async (req, res) => {
  try {
    const { idEstado } = req.params;

    // Validación básica de ID numérico
    const idNumber = parseInt(idEstado);
    if (isNaN(idNumber) || idNumber <= 0) {
      return res.status(400).json({ error: "ID de estado inválido." });
    }

    const state = await Estado.findByPk(idNumber);

    if (state) {
      res.status(200).json(state);
    } else {
      res
        .status(404)
        .json({ error: `Estado con ID ${idEstado} no encontrado.` });
    }
  } catch (error) {
    console.error(`Error al obtener estado ${req.params.idEstado}:`, error);
    res.status(500).json({
      error: error.message || "Error interno del servidor al buscar el estado.",
    });
  }
};

// --------------------------------------------------------
// 4. ACTUALIZAR ESTADO (PATCH /estados/:idEstado)
// --------------------------------------------------------
export const updateState = async (req, res) => {
  try {
    console.log("🔍 [updateState] Params:", req.params);

    const { idEstado } = req.params;
    const data = req.body;

    // Validación más robusta
    if (!idEstado || idEstado.trim() === "") {
      return res.status(400).json({
        error: "ID de estado requerido.",
        details: "El parámetro idEstado es obligatorio en la URL.",
      });
    }

    const idNumber = parseInt(idEstado);
    if (isNaN(idNumber) || idNumber <= 0) {
      return res.status(400).json({
        error: "ID de estado inválido.",
        details: `El ID debe ser un número positivo. Recibido: "${idEstado}"`,
      });
    }

    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      return res.status(400).json({
        error: "Datos requeridos.",
        details: "Se necesitan datos en el cuerpo de la solicitud.",
      });
    }

    const state = await Estado.findByPk(idNumber);

    if (!state) {
      return res.status(404).json({
        error: "Estado no encontrado.",
        details: `No se encontró un estado con ID: ${idNumber}`,
      });
    }

    await state.update(data);

    res.status(200).json({
      message: "Estado actualizado correctamente.",
      idEstado: idNumber,
      updatedFields: Object.keys(data),
      data: state,
    });
  } catch (error) {
    console.error(`Error al actualizar estado:`, error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "El nombre del estado ya existe.",
      });
    }

    res.status(500).json({
      error: "Error interno del servidor.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// --------------------------------------------------------
// 5. ELIMINAR ESTADO (DELETE /estados/:idEstado)
// --------------------------------------------------------
export const deleteState = async (req, res) => {
  try {
    const { idEstado } = req.params;
    const idNumber = parseInt(idEstado);

    if (isNaN(idNumber) || idNumber <= 0) {
      return res.status(400).json({ error: "ID de estado inválido." });
    }

    const state = await Estado.findByPk(idNumber);

    if (!state) {
      return res
        .status(404)
        .json({ error: `Estado con ID ${idEstado} no encontrado.` });
    }

    await state.destroy();

    res.status(204).send(); // 204 No Content para eliminación exitosa
  } catch (error) {
    console.error(`Error al eliminar estado ${req.params.idEstado}:`, error);

    // Manejo de error de clave foránea
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({
        error: "No se puede eliminar este estado porque está siendo utilizado.",
      });
    }

    res.status(500).json({
      error:
        error.message || "Error interno del servidor al eliminar el estado.",
    });
  }
};
