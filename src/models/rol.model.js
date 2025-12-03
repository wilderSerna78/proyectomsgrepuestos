// --------------------------------------------------------
// category.model.js — Modelo para la tabla "Categorias"
// --------------------------------------------------------

import { connectMySQL } from "../config/mysql.config.js";

// --------------------------------------------------------
// C: CREAR CATEGORÍA (Create)
// --------------------------------------------------------
/**
 * Crea una nueva categoría.
 * @param {string} nombreCategoria - Nombre de la categoría.
 * @param {string} descripcion - Descripción opcional.
 * @returns {Promise<number>} ID de la categoría creada.
 */
export const createCategory = async (nombreCategoria, descripcion) => {
  const connection = await connectMySQL();
  try {
    const [result] = await connection.execute(
      "INSERT INTO Categorias (nombreCategoria, descripcion) VALUES (?, ?)",
      [nombreCategoria, descripcion]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error en createCategory:", error);

    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("El nombre de la categoría ya existe.");
    }

    throw new Error("No se pudo crear la categoría.");
  } finally {
    await connection.end();
  }
};

// --------------------------------------------------------
// R: LEER CATEGORÍAS (Read - Todas y por ID)
// --------------------------------------------------------
/**
 * Obtiene todas las categorías.
 * @returns {Promise<Array>} Lista de categorías.
 */
export const getAllCategories = async () => {
  const connection = await connectMySQL();
  try {
    const [rows] = await connection.execute(
      "SELECT idCategoria, nombreCategoria, descripcion FROM Categorias ORDER BY nombreCategoria"
    );
    return rows;
  } catch (error) {
    console.error("Error en getAllCategories:", error);
    throw new Error("No se pudo obtener la lista de categorías.");
  } finally {
    await connection.end();
  }
};

/**
 * Obtiene una categoría por su ID.
 * @param {number} idCategoria - ID de la categoría.
 * @returns {Promise<Object|null>} La categoría o null si no existe.
 */
export const getCategoryById = async (idCategoria) => {
  const connection = await connectMySQL();
  try {
    const [rows] = await connection.execute(
      "SELECT idCategoria, nombreCategoria, descripcion FROM Categorias WHERE idCategoria = ?",
      [idCategoria]
    );
    return rows[0] || null;
  } catch (error) {
    console.error(`Error en getCategoryById para ID ${idCategoria}:`, error);
    throw new Error(`No se pudo obtener la categoría con ID ${idCategoria}.`);
  } finally {
    await connection.end();
  }
};

// --------------------------------------------------------
// U: ACTUALIZAR CATEGORÍA (Update)
// --------------------------------------------------------
/**
 * Actualiza parcialmente una categoría.
 * @param {number} idCategoria - ID de la categoría.
 * @param {object} data - Campos a actualizar (ej: {nombreCategoria: 'Nuevo'}).
 * @returns {Promise<boolean>} True si se actualizó, false si no se encontró.
 */
export const updateCategory = async (idCategoria, data) => {
  const connection = await connectMySQL();
  try {
    const fields = Object.keys(data);
    const values = Object.values(data);

    // Si no hay datos que actualizar
    if (fields.length === 0) return false;

    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const params = [...values, idCategoria];

    const [result] = await connection.execute(
      `UPDATE Categorias SET ${setClause} WHERE idCategoria = ?`,
      params
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error en updateCategory para ID ${idCategoria}:`, error);

    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("El nombre de la categoría ya existe.");
    }

    throw new Error("No se pudo actualizar la categoría.");
  } finally {
    await connection.end();
  }
};

// --------------------------------------------------------
// D: ELIMINAR CATEGORÍA (Delete)
// --------------------------------------------------------
/**
 * Elimina una categoría por su ID.
 * @param {number} idCategoria - ID de la categoría a eliminar.
 * @returns {Promise<boolean>} True si se eliminó, false si no existía.
 */
export const deleteCategory = async (idCategoria) => {
  const connection = await connectMySQL();
  try {
    const [result] = await connection.execute(
      "DELETE FROM Categorias WHERE idCategoria = ?",
      [idCategoria]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error en deleteCategory para ID ${idCategoria}:`, error);

    // Categoría usada en Productos (FK)
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new Error(
        "No se puede eliminar la categoría porque está asignada a uno o más productos."
      );
    }

    throw new Error("No se pudo eliminar la categoría.");
  } finally {
    await connection.end();
  }
};
