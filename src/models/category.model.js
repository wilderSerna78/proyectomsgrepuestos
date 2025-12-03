// --- category.model.js ---
import { connectMySQL } from "../config/mysql.config.js";

export const Category = {};

/* ============================================================
   📌 CREAR CATEGORÍA
   ------------------------------------------------------------
   Inserta una nueva categoría en la base de datos.
   @param {object} categoryData - { nombreCategoria, descripcion }
   @returns {object} - { idCategoria }
   ============================================================ */
Category.createCategory = async (categoryData) => {
    const connection = await connectMySQL();
    const { nombreCategoria, descripcion } = categoryData;

    const query = `
        INSERT INTO Categorias (nombreCategoria, descripcion)
        VALUES (?, ?)
    `;

    try {
        const [result] = await connection.execute(query, [
            nombreCategoria,
            descripcion
        ]);
        return { idCategoria: result.insertId };
    } catch (error) {
        console.error("❌ Error al crear categoría:", error);

        // ER_DUP_ENTRY → entrada duplicada
        if (error.code === "ER_DUP_ENTRY") {
            throw new Error("El nombre de la categoría ya existe.");
        }

        throw new Error("Error en la base de datos al crear la categoría.");
    } finally {
        await connection.end();
    }
};



/* ============================================================
   📌 OBTENER TODAS LAS CATEGORÍAS
   ------------------------------------------------------------
   Devuelve la lista completa de categorías registradas.
   @returns {Array<object>}
   ============================================================ */
Category.getAllCategories = async () => {
    const connection = await connectMySQL();

    const query = `
        SELECT idCategoria, nombreCategoria, descripcion
        FROM Categorias
        ORDER BY nombreCategoria;
    `;

    try {
        const [rows] = await connection.execute(query);
        return rows;
    } catch (error) {
        console.error("❌ Error al consultar categorías:", error);
        throw new Error("Error al obtener categorías desde la base de datos.");
    } finally {
        await connection.end();
    }
};



/* ============================================================
   📌 OBTENER CATEGORÍA POR ID
   ------------------------------------------------------------
   Obtiene una categoría específica según su ID.
   @param {number} idCategoria
   @returns {object|null}
   ============================================================ */
Category.getCategoryById = async (idCategoria) => {
    const connection = await connectMySQL();

    const query = `
        SELECT idCategoria, nombreCategoria, descripcion
        FROM Categorias
        WHERE idCategoria = ?
    `;

    try {
        const [rows] = await connection.execute(query, [idCategoria]);
        return rows[0] || null;
    } catch (error) {
        console.error(`❌ Error al consultar categoría ID ${idCategoria}:`, error);
        throw new Error("Error en la base de datos al obtener la categoría.");
    } finally {
        await connection.end();
    }
};



/* ============================================================
   📌 ACTUALIZAR CATEGORÍA
   ------------------------------------------------------------
   Actualiza los datos de una categoría.
   Solo modifica los campos enviados en categoryData.
   @param {number} idCategoria
   @param {object} categoryData
   @returns {number} filas afectadas (1 si tuvo éxito)
   ============================================================ */
Category.updateCategory = async (idCategoria, categoryData) => {
    const connection = await connectMySQL();

    // Construcción dinámica del SET basado en los campos enviados
    const setClauses = [];
    const values = [];

    for (const key in categoryData) {
        setClauses.push(`${key} = ?`);
        values.push(categoryData[key]);
    }

    // Si no hay campos para actualizar
    if (setClauses.length === 0) return 0;

    values.push(idCategoria);

    const query = `
        UPDATE Categorias 
        SET ${setClauses.join(", ")} 
        WHERE idCategoria = ?
    `;

    try {
        const [result] = await connection.execute(query, values);
        return result.affectedRows;
    } catch (error) {
        console.error(`❌ Error al actualizar categoría ID ${idCategoria}:`, error);

        if (error.code === "ER_DUP_ENTRY") {
            throw new Error("El nombre de la categoría ya existe.");
        }

        throw new Error("Error en la base de datos al actualizar la categoría.");
    } finally {
        await connection.end();
    }
};



/* ============================================================
   📌 ELIMINAR CATEGORÍA
   ------------------------------------------------------------
   Elimina una categoría por su ID.
   No permite eliminar si está relacionada con productos.
   @param {number} idCategoria
   @returns {number} filas afectadas (1 si tuvo éxito)
   ============================================================ */
Category.deleteCategory = async (idCategoria) => {
    const connection = await connectMySQL();

    const query = `
        DELETE FROM Categorias 
        WHERE idCategoria = ?
    `;

    try {
        const [result] = await connection.execute(query, [idCategoria]);
        return result.affectedRows;
    } catch (error) {
        console.error(`❌ Error al eliminar categoría ID ${idCategoria}:`, error);

        // ER_ROW_IS_REFERENCED_2 → clave foránea en uso
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            throw new Error(
                "No se puede eliminar la categoría porque está asignada a uno o más productos."
            );
        }

        throw new Error("Error en la base de datos al eliminar la categoría.");
    } finally {
        await connection.end();
    }
};
