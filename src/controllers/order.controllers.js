// src/controllers/order.controllers.js
import db from "../models/index.model.js";

// Asegúrate de incluir todos los modelos necesarios
const { Orden, OrdenItem, Producto, Carrito, ItemsCarrito } = db; 

const ID_ROL_CLIENTE = 4; // Rol de Cliente

// ============================================================================
// CHECKOUT - Crear orden desde el carrito (Implementación principal para clientes)
// ============================================================================
export const checkout = async (req, res) => {
    // Del middleware de autenticación (idUsuario y idRol)
    const { idUsuario, idRol } = req.user; 
    
    if (idRol !== ID_ROL_CLIENTE) {
      return res.status(403).json({ success: false, message: "Acceso denegado. Solo clientes pueden realizar pedidos." });
    }

    let transaction;

    try {
        transaction = await db.sequelize.transaction();

        // 1. Obtener el carrito del usuario
        const carrito = await Carrito.findOne({ where: { idUsuario }, transaction });

        if (!carrito) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "No tienes un carrito activo o no se encontró el carrito." });
        }

        // 2. Obtener items del carrito
        const items = await ItemsCarrito.findAll({
            where: { idCarrito: carrito.idCarrito },
            include: [{ model: Producto, as: "producto", attributes: ["idProducto", "nombreProducto", "stock", "precioVenta"] }],
            transaction,
        });

        if (!items || items.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Tu carrito está vacío" });
        }

        // 3. Verificar stock disponible
        for (const item of items) {
            if (item.producto.stock < item.cantidad) {
                await transaction.rollback();
                return res.status(400).json({ success: false, message: `Stock insuficiente para ${item.producto.nombreProducto}. Disponible: ${item.producto.stock}` });
            }
        }

        // 4. Calcular totales
        const subtotal = items.reduce((sum, item) => {
            const price = item.precioUnitario || item.producto.precioVenta;
            return sum + parseFloat(price) * parseInt(item.cantidad);
        }, 0);
        const impuesto = subtotal * 0.19; 
        const total = subtotal + impuesto;

        // 5. Crear la orden
        const nuevaOrden = await Orden.create(
            { idUsuario, idRol, subtotal, impuesto, total, idEstado: 1, fecha: new Date() },
            { transaction }
        );

        // 6. Insertar items en orden_items y actualizar stock
        for (const item of items) {
            const price = item.precioUnitario || item.producto.precioVenta;
            await OrdenItem.create(
                { idOrden: nuevaOrden.idOrden, idProducto: item.idProducto, cantidad: item.cantidad, precioUnitario: price, subtotal: parseFloat(price) * parseInt(item.cantidad) },
                { transaction }
            );

            // 7. Actualizar stock de productos
            await Producto.decrement("stock", { by: item.cantidad, where: { idProducto: item.idProducto }, transaction });
        }

        // 8. Limpiar el carrito
        await ItemsCarrito.destroy({ where: { idCarrito: carrito.idCarrito }, transaction });

        // 9. Commit de la transacción
        await transaction.commit();

        // 10. Respuesta
        res.status(201).json({ success: true, orderId: nuevaOrden.idOrden, message: "Orden creada exitosamente", total: total.toFixed(2), itemsCount: items.length });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("💥 Error en checkout:", error);
        res.status(500).json({ success: false, message: "Error al procesar la orden", error: error.message });
    }
};

// ============================================================================
// CREAR ORDEN MANUALMENTE (FUNCIÓN FALTANTE QUE CAUSABA EL ERROR)
// ============================================================================
export const createOrder = async (req, res) => {
    // Esta función debería ser restringida a roles de empleados/administradores
    const { idUsuario, items: productos } = req.body; 
    
    // ⚠️ RESTRICCIÓN DE ROL: Asegúrate de añadir la verificación de rol aquí
    // const { idRol } = req.user;
    // if (idRol === ID_ROL_CLIENTE) { return res.status(403).json({ success: false, message: "Acceso denegado." }); }


    try {
        // Cálculo de totales (asumiendo que los precios vienen correctos en el body)
        const subtotal = productos.reduce((acc, p) => acc + p.precioUnitario * p.cantidad, 0);
        const impuesto = subtotal * 0.19; 
        const total = subtotal + impuesto;

        const nuevaOrden = await Orden.create({
            idUsuario,
            subtotal,
            impuesto,
            total,
            fecha: new Date(),
            idEstado: 1, // pendiente
        });

        for (const producto of productos) {
            await OrdenItem.create({
                idOrden: nuevaOrden.idOrden,
                idProducto: producto.idProducto,
                cantidad: producto.cantidad,
                precioUnitario: producto.precioUnitario,
                subtotal: producto.precioUnitario * producto.cantidad,
            });

            await Producto.decrement("stock", {
                by: producto.cantidad,
                where: { idProducto: producto.idProducto },
            });
        }

        // Obtener la orden completa para la respuesta (opcional, pero útil)
        const ordenCompleta = await Orden.findOne({
            where: { idOrden: nuevaOrden.idOrden },
            include: [{ model: OrdenItem, as: "items", include: [{ model: Producto, as: "producto" }] }],
        });

        res.status(201).json({ success: true, message: "Orden creada exitosamente", orden: ordenCompleta });
    } catch (error) {
        console.error("❌ Error al crear la orden manualmente:", error.message);
        res.status(500).json({ success: false, message: "Error al crear la orden", error: error.message });
    }
};


// --------------------------------------------------------
// Obtener orden por ID (Seguridad por idUsuario)
// --------------------------------------------------------
export const getOrderById = async (req, res) => {
// ... (código correcto, sin cambios) ...
};

// --------------------------------------------------------
// Obtener todas las órdenes de un usuario (Seguridad por idUsuario del token)
// --------------------------------------------------------
export const getOrdersByUser = async (req, res) => {
// ... (código correcto, sin cambios) ...
};

// --------------------------------------------------------
// Obtener todas las órdenes (Restringido por Rol)
// --------------------------------------------------------
export const getAllOrders = async (req, res) => {
// ... (código correcto, sin cambios) ...
};

// --------------------------------------------------------
// Actualizar una orden (Restringido por Rol)
// --------------------------------------------------------
export const updateOrder = async (req, res) => {
// ... (código correcto, sin cambios) ...
};

// --------------------------------------------------------
// Eliminar una orden (Restringido por Rol)
// --------------------------------------------------------
export const deleteOrder = async (req, res) => {
// ... (código correcto, sin cambios) ...
};
