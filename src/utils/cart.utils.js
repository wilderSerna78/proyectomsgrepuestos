// src/utils/cart.utils.js

import { connectMySQL } from "../config/mysql.config.js";

/**
 * Busca un carrito existente para un usuario o crea uno nuevo si no existe.
 * Retorna el idCarrito.
 */
export const ensureCartExists = async (idUsuario) => {
    let connection;
    try {
        connection = await connectMySQL();

        // 1. Buscar carrito existente
        const [existing] = await connection.query(
            "SELECT idCarrito FROM carrito WHERE idUsuario = ?",
            [idUsuario]
        );

        if (existing.length > 0) {
            console.log(`[Carrito] Carrito existente encontrado: ${existing[0].idCarrito}`);
            return existing[0].idCarrito;
        }

        // 2. Si no existe, crear uno
        const [result] = await connection.query(
            "INSERT INTO carrito (idUsuario, fechaActualizacion) VALUES (?, NOW())",
            [idUsuario]
        );

        const newCartId = result.insertId;
        console.log(`[Carrito] Nuevo carrito creado con ID: ${newCartId}`);
        return newCartId;

    } catch (error) {
        console.error("❌ Error en ensureCartExists:", error.message);
        throw new Error("Fallo al asegurar la existencia del carrito.");
    } finally {
        if (connection) await connection.end();
    }
};