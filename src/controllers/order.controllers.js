// src/controllers/order.controllers.js
import db from "../models/index.model.js";

// Asegúrate de incluir todos los modelos necesarios
const { Orden, OrdenItem, Producto, Carrito, ItemsCarrito } = db;

const ID_ROL_CLIENTE = 4; // Rol de Cliente

// ============================================================================
// CHECKOUT - Crear orden desde el carrito (Implementación principal para clientes)
// ============================================================================
export const checkout = async (req, res) => {
  const { idUsuario, idRol } = req.user || {};

  // Logs básicos de depuración
  console.log("🟢 Usuario:", req.user);

  if (!idUsuario || !idRol) {
    return res
      .status(401)
      .json({ success: false, message: "Token inválido o ausente." });
  }

  if (idRol !== ID_ROL_CLIENTE) {
    return res
      .status(403)
      .json({ success: false, message: "Acceso denegado." });
  }

  let transaction;

  try {
    transaction = await db.sequelize.transaction();

    const carrito = await Carrito.findOne({
      where: { idUsuario },
      transaction,
    });
    console.log("🟢 Carrito:", carrito);

    if (!carrito) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Carrito no encontrado." });
    }

    const items = await ItemsCarrito.findAll({
      where: { idCarrito: carrito.idCarrito },
      include: [
        {
          model: Producto,
          as: "producto",
          attributes: ["idProducto", "nombreProducto", "stock", "precioVenta"],
        },
      ],
      transaction,
    });
    console.log("🟢 Items:", items);

    if (!items?.length) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Carrito vacío." });
    }

    for (const item of items) {
      if (!item.producto || item.producto.stock < item.cantidad) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para ${
            item.producto?.nombreProducto || "producto"
          }`,
        });
      }
    }

    const subtotal = items.reduce((sum, item) => {
      const price = Number(item.precioUnitario ?? item.producto.precioVenta);
      return sum + price * Number(item.cantidad);
    }, 0);

    const impuesto = subtotal * 0.19;
    const total = subtotal + impuesto;

    const nuevaOrden = await Orden.create(
      {
        idUsuario,
        idRol,
        subtotal,
        impuesto,
        total,
        idEstado: 1,
        fecha: new Date(),
      },
      { transaction }
    );

    for (const item of items) {
      const price = Number(item.precioUnitario ?? item.producto.precioVenta);

      await OrdenItem.create(
        {
          idOrden: nuevaOrden.idOrden,
          idProducto: item.idProducto,
          cantidad: item.cantidad,
          precioUnitario: price,
          subtotal: price * Number(item.cantidad),
        },
        { transaction }
      );

      await Producto.decrement("stock", {
        by: item.cantidad,
        where: { idProducto: item.idProducto },
        transaction,
      });
    }

    await ItemsCarrito.destroy({
      where: { idCarrito: carrito.idCarrito },
      transaction,
    });

    await transaction.commit();

    return res.status(201).json({
      success: true,
      orderId: nuevaOrden.idOrden,
      total: total.toFixed(2),
      itemsCount: items.length,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("💥 Error en checkout:", error);

    return res.status(500).json({
      success: false,
      message: "Error al procesar la orden",
      error: error.message,
    });
  }
};

// ============================================================================
// CREAR ORDEN MANUALMENTE (FUNCIÓN FALTANTE QUE CAUSABA EL ERROR)
// ============================================================================
export const createOrder = async (req, res) => {
  const { idUsuario, items: productos } = req.body || {};

  // Logs básicos para depuración
  // console.log("🟢 Body recibido:", req.body);

  if (!idUsuario) {
    return res
      .status(400)
      .json({ success: false, message: "idUsuario es requerido." });
  }

  if (!Array.isArray(productos) || productos.length === 0) {
    return res
      .status(400)
      .json({
        success: false,
        message: "La lista de productos es inválida o está vacía.",
      });
  }

  try {
    const subtotal = productos.reduce((acc, p) => {
      return acc + Number(p.precioUnitario) * Number(p.cantidad);
    }, 0);

    const impuesto = subtotal * 0.19;
    const total = subtotal + impuesto;

    const nuevaOrden = await Orden.create({
      idUsuario,
      subtotal,
      impuesto,
      total,
      fecha: new Date(),
      idEstado: 1,
    });

    for (const producto of productos) {
      if (
        !producto.idProducto ||
        !producto.cantidad ||
        !producto.precioUnitario
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Datos de producto incompletos." });
      }

      await OrdenItem.create({
        idOrden: nuevaOrden.idOrden,
        idProducto: producto.idProducto,
        cantidad: Number(producto.cantidad),
        precioUnitario: Number(producto.precioUnitario),
        subtotal: Number(producto.precioUnitario) * Number(producto.cantidad),
      });

      await Producto.decrement("stock", {
        by: Number(producto.cantidad),
        where: { idProducto: producto.idProducto },
      });
    }

    const ordenCompleta = await Orden.findOne({
      where: { idOrden: nuevaOrden.idOrden },
      include: [
        {
          model: OrdenItem,
          as: "items",
          include: [{ model: Producto, as: "producto" }],
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Orden creada exitosamente",
      orden: ordenCompleta,
    });
  } catch (error) {
    console.error("❌ Error al crear orden:", error);

    return res.status(500).json({
      success: false,
      message: "Error interno al crear la orden",
      error: error.message,
    });
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
