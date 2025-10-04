import { connectMySQL } from '../config/mysql.config.js'; // Asegura la ruta de tu conexión a DB

// --------------------------------------------------------
// C: CREAR ESTADO (Create)
// --------------------------------------------------------
/**
 * Crea un nuevo estado en la base de datos.
 * @param {string} nombre - El nombre del nuevo estado (ej: 'Activo', 'Inactivo').
 * @param {string} descripcion - La descripción del estado.
 * @returns {Promise<number>} El ID del estado recién creado (insertId).
 */
export const createState = async (nombre, descripcion) => {
    const connection = await connectMySQL();
    try {
        const [result] = await connection.execute(
            'INSERT INTO estado (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion]
        );
        return result.insertId;
    } catch (error) {
        console.error("Error en createState:", error);
        // Manejar duplicidad si 'nombre' es único en la DB
        throw new Error("No se pudo crear el estado. Verifique que el nombre no exista.");
    } finally {
        await connection.end();
    }
};

// --------------------------------------------------------
// R: LEER ESTADOS (Read - Todos y por ID)
// --------------------------------------------------------
/**
 * Obtiene todos los estados disponibles en la base de datos.
 */
export const getAllStates = async () => {
    const connection = await connectMySQL();
    try {
        const [rows] = await connection.execute(
            'SELECT idEstado, nombre, descripcion FROM estado'
        );
        return rows; 
    } catch (error) {
        console.error("Error en getAllStates:", error);
        throw new Error("No se pudo obtener la lista de estados.");
    } finally {
        await connection.end();
    }
};

/**
 * Obtiene un estado específico por su ID.
 * @param {number} idEstado - El ID del estado a buscar.
 * @returns {Promise<Object|null>} El objeto estado o null si no se encuentra.
 */
export const getStateById = async (idEstado) => {
    const connection = await connectMySQL();
    try {
        const [rows] = await connection.execute(
            'SELECT idEstado, nombre, descripcion FROM estado WHERE idEstado = ?',
            [idEstado]
        );
        return rows[0] || null; 
    } catch (error) {
        console.error(`Error en getStateById para ID ${idEstado}:`, error);
        throw new Error(`No se pudo obtener el estado con ID ${idEstado}.`);
    } finally {
        await connection.end();
    }
};

// --------------------------------------------------------
// U: ACTUALIZAR ESTADO (Update - Actualización dinámica)
// --------------------------------------------------------
/**
 * Actualiza parcialmente un estado por su ID.
 * @param {number} idEstado - El ID del estado a actualizar.
 * @param {Object} data - Objeto con los campos a modificar (ej: {nombre: 'Nuevo'}).
 * @returns {Promise<boolean>} True si se actualizó al menos una fila.
 */
export const updateState = async (idEstado, data) => {
    const connection = await connectMySQL();
    try {
        const fields = Object.keys(data);
        const values = Object.values(data);

        if (fields.length === 0) {
            return false;
        }

        // Construye la cláusula SET dinámicamente
        const setClauses = fields.map(field => `${field} = ?`).join(', ');
        const queryValues = [...values, idEstado];

        const [result] = await connection.execute(
            `UPDATE estado SET ${setClauses} WHERE idEstado = ?`,
            queryValues
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Error en updateState para ID ${idEstado}:`, error);
        throw new Error("No se pudo actualizar el estado. Verifique los datos.");
    } finally {
        await connection.end();
    }
};

// --------------------------------------------------------
// D: ELIMINAR ESTADO (Delete)
// --------------------------------------------------------
/**
 * Elimina un estado específico por su ID.
 * @param {number} idEstado - El ID del estado a eliminar.
 * @returns {Promise<boolean>} True si se eliminó el estado.
 */
export const deleteState = async (idEstado) => {
    const connection = await connectMySQL();
    try {
        const [result] = await connection.execute(
            'DELETE FROM estado WHERE idEstado = ?',
            [idEstado]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Error en deleteState para ID ${idEstado}:`, error);
        // Manejo específico si el estado está siendo usado por otra tabla (ej: usuario)
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             throw new Error("No se puede eliminar este estado porque está siendo utilizado.");
        }
        throw new Error("No se pudo eliminar el estado.");
    } finally {
        await connection.end();
    }
};