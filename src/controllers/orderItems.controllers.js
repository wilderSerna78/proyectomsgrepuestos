// src/controllers/orderItems.controllers.js
import db from "../models/index.model.js";

const { Orden, OrdenItem, Producto } = db;

/* ============================================================
   📌 Agregar item a una orden
   ------------------------------------------------------------
   @route   POST /api/v1/order-items
   @access  Private/Admin
   ============================================================ */
export const addItemToOrder = async (req, res) => {
  try {
    const { idOrden, idProducto, cantidad } = req.body;

    if (!idOrden || !idProducto || !cantidad) {
      return res.status(400).json({ error: "Datos incompletos." });
    }

    const order = await Orden.findByPk(idOrden);
    if (!order) return res.status(404).json({ error: "Orden no encontrada." });

    const product = await Producto.findByPk(idProducto);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado." });

    if (product.stock < cantidad) {
      return res.status(400).json({
        error: "Stock insuficiente.",
        stockDisponible: product.stock,
      });
    }

    const newItem = await OrdenItem.create({
      idOrden,
      idProducto,
      cantidad,
      precioUnitario: product.precioVenta,
      subtotal: cantidad * product.precioVenta,
    });

    return res.status(201).json({
      success: true,
      message: "Item agregado a la orden.",
      item: newItem,
    });
  } catch (error) {
    console.error("❌ Error en addItemToOrder:", error.message);
    return res.status(500).json({ error: "Error al agregar item a la orden." });
  }
};

/* ============================================================
   📌 Obtener items de una orden
   ------------------------------------------------------------
   @route   GET /api/v1/order-items/order/:idOrden
   @access  Private/Admin
   ============================================================ */
export const getItemsByOrder = async (req, res) => {
  try {
    const { idOrden } = req.params;

    const order = await Orden.findByPk(idOrden);
    if (!order) return res.status(404).json({ error: "Orden no encontrada." });

    const items = await OrdenItem.findAll({
      where: { idOrden },
      include: [
        {
          model: Producto,
          as: "producto", // alias definido en orden_items.model.js
          attributes: ["idProducto", "nombreProducto", "precioVenta", "imagen"],
        },
      ],
    });

    return res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("❌ Error en getItemsByOrder:", error.message);
    return res
      .status(500)
      .json({ error: "Error al obtener items de la orden." });
  }
};

/* ============================================================
   📌 Actualizar item de una orden
   ------------------------------------------------------------
   @route   PUT /api/v1/order-items/:idItem
   @access  Private/Admin
   ============================================================ */
export const updateItemInOrder = async (req, res) => {
  try {
    const { idItem } = req.params;
    const { cantidad } = req.body;

    const item = await OrdenItem.findByPk(idItem);
    if (!item) return res.status(404).json({ error: "Item no encontrado." });

    const product = await Producto.findByPk(item.idProducto);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado." });

    if (product.stock < cantidad) {
      return res.status(400).json({
        error: "Stock insuficiente.",
        stockDisponible: product.stock,
      });
    }

    item.cantidad = cantidad;
    item.subtotal = cantidad * product.precioVenta;
    await item.save();

    return res.json({
      success: true,
      message: "Item actualizado exitosamente.",
      item,
    });
  } catch (error) {
    console.error("❌ Error en updateItemInOrder:", error.message);
    return res
      .status(500)
      .json({ error: "Error al actualizar item de la orden." });
  }
};

/* ============================================================
   📌 Eliminar item de una orden
   ------------------------------------------------------------
   @route   DELETE /api/v1/order-items/:idItem
   @access  Private/Admin
   ============================================================ */
export const deleteItemFromOrder = async (req, res) => {
  try {
    const { idItem } = req.params;

    const item = await OrdenItem.findByPk(idItem);
    if (!item) return res.status(404).json({ error: "Item no encontrado." });

    await item.destroy();

    return res.json({
      success: true,
      message: "Item eliminado de la orden.",
    });
  } catch (error) {
    console.error("❌ Error en deleteItemFromOrder:", error.message);
    return res
      .status(500)
      .json({ error: "Error al eliminar item de la orden." });
  }
};
