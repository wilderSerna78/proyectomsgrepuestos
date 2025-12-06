// src/controllers/itemsCart.controllers.js
import db from "../models/index.model.js";

const { ItemsCarrito, Carrito, Producto } = db;

// Helper para actualizar timestamp del carrito
const updateCartTimestamp = async (cart) => {
  if (cart) {
    await cart.update({ fechaActualizacion: new Date() });
  }
};

// ==========================================================
// 📌 Obtener todos los items de un carrito
// ==========================================================
export const getItemsByCart = async (req, res) => {
  try {
    const { idCarrito } = req.params;

    if (!idCarrito) {
      return res.status(400).json({ success: false, error: "idCarrito es obligatorio" });
    }

    const cart = await Carrito.findByPk(idCarrito);
    if (!cart) {
      return res.status(404).json({ success: false, error: "Carrito no encontrado" });
    }

    const items = await ItemsCarrito.findAll({
      where: { idCarrito },
      include: [
        {
          model: Producto,
          as: "producto",
          attributes: ["idProducto", "nombreProducto", "precioVenta", "imagen", "stock"],
        },
      ],
    });

    return res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("❌ Error en getItemsByCart:", error);
    return res.status(500).json({ success: false, error: "Error al obtener los items del carrito" });
  }
};

// ==========================================================
// 📌 Agregar producto al carrito
// ==========================================================
export const addItemToCart = async (req, res) => {
  try {
    const { idCarrito, idProducto, cantidad = 1 } = req.body;

    if (!idCarrito || !idProducto) {
      return res.status(400).json({ success: false, error: "idCarrito e idProducto son obligatorios" });
    }
    if (cantidad <= 0) {
      return res.status(400).json({ success: false, error: "La cantidad debe ser mayor a 0" });
    }

    const cart = await Carrito.findByPk(idCarrito);
    if (!cart) return res.status(404).json({ success: false, error: "Carrito no encontrado" });

    const product = await Producto.findByPk(idProducto);
    if (!product) return res.status(404).json({ success: false, error: "Producto no encontrado" });

    if (product.stock < cantidad) {
      return res.status(400).json({
        success: false,
        error: "Stock insuficiente",
        stockDisponible: product.stock,
      });
    }

    const existingItem = await ItemsCarrito.findOne({ where: { idCarrito, idProducto } });

    if (existingItem) {
      const nuevaCantidad = existingItem.cantidad + cantidad;
      if (product.stock < nuevaCantidad) {
        return res.status(400).json({
          success: false,
          error: "Stock insuficiente para la cantidad solicitada",
          stockDisponible: product.stock,
          cantidadActualEnCarrito: existingItem.cantidad,
        });
      }

      existingItem.cantidad = nuevaCantidad;
      await existingItem.save();
      await updateCartTimestamp(cart);

      return res.json({
        success: true,
        message: "Cantidad actualizada",
        data: existingItem,
      });
    }

    const newItem = await ItemsCarrito.create({
      idCarrito,
      idProducto,
      cantidad,
      precioUnitario: parseFloat(product.precioVenta),
    });

    await updateCartTimestamp(cart);

    return res.status(201).json({
      success: true,
      message: "Producto agregado al carrito",
      data: newItem,
    });
  } catch (error) {
    console.error("❌ Error en addItemToCart:", error);
    return res.status(500).json({ success: false, error: "Error al agregar item al carrito" });
  }
};

// ==========================================================
// 📌 Actualizar cantidad de un item
// ==========================================================
export const updateItemQuantity = async (req, res) => {
  try {
    const { idItemCarrito } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ success: false, error: "La cantidad debe ser mayor a 0" });
    }

    const item = await ItemsCarrito.findByPk(idItemCarrito);
    if (!item) return res.status(404).json({ success: false, error: "Item no encontrado" });

    const product = await Producto.findByPk(item.idProducto);
    if (!product) return res.status(404).json({ success: false, error: "Producto no encontrado" });

    if (product.stock < cantidad) {
      return res.status(400).json({
        success: false,
        error: "Stock insuficiente",
        stockDisponible: product.stock,
      });
    }

    item.cantidad = cantidad;
    await item.save();

    const cart = await Carrito.findByPk(item.idCarrito);
    await updateCartTimestamp(cart);

    return res.json({
      success: true,
      message: "Cantidad actualizada",
      data: item,
    });
  } catch (error) {
    console.error("❌ Error en updateItemQuantity:", error);
    return res.status(500).json({ success: false, error: "Error al actualizar item" });
  }
};

// ==========================================================
// 📌 Eliminar item del carrito
// ==========================================================
export const deleteItem = async (req, res) => {
  try {
    const { idItemCarrito } = req.params;

    const item = await ItemsCarrito.findByPk(idItemCarrito);
    if (!item) return res.status(404).json({ success: false, error: "Item no encontrado" });

    const idCarrito = item.idCarrito;
    await item.destroy();

    const cart = await Carrito.findByPk(idCarrito);
    await updateCartTimestamp(cart);

    return res.json({ success: true, message: "Item eliminado" });
  } catch (error) {
    console.error("❌ Error en deleteItem:", error);
    return res.status(500).json({ success: false, error: "Error al eliminar item del carrito" });
  }
};

// ==========================================================
// 📌 Vaciar carrito
// ==========================================================
export const clearCart = async (req, res) => {
  try {
    const { idCarrito } = req.params;

    const cart = await Carrito.findByPk(idCarrito);
    if (!cart) return res.status(404).json({ success: false, error: "Carrito no encontrado" });

    const deletedCount = await ItemsCarrito.destroy({ where: { idCarrito } });
    await updateCartTimestamp(cart);

    return res.json({
      success: true,
      message: "Carrito vaciado",
      itemsEliminados: deletedCount,
    });
  } catch (error) {
    console.error("❌ Error en clearCart:", error);
    return res.status(500).json({ success: false, error: "Error al vaciar el carrito" });
  }
};



// // src/controllers/itemsCart.controllers.js

// import db from "../models/index.model.js";

// // Usa los nombres correctos en singular
// const { ItemsCarrito, Carrito, Producto } = db;

// // ==========================================================
// // 📌 Obtener todos los items de un carrito
// // ==========================================================
// export const getItemsByCart = async (req, res) => {
//   try {
//     const { idCarrito } = req.params;

//     const cart = await Carrito.findByPk(idCarrito);
//     if (!cart) {
//       return res.status(404).json({ error: "Carrito no encontrado" });
//     }

//     const items = await ItemsCarrito.findAll({
//       where: { idCarrito },
//       include: [
//         {
//           model: Producto, // ← singular
//           as: "producto",  // ← alias definido en itemsCart.model.js
//           attributes: [
//             "idProducto",
//             "nombreProducto",
//             "precioVenta",
//             "imagen",
//             "stock",
//           ],
//         },
//       ],
//     });

//     return res.json({
//       success: true,
//       count: items.length,
//       data: items,
//     });
//   } catch (error) {
//     console.error("❌ Error en getItemsByCart:", error.message);
//     return res
//       .status(500)
//       .json({ error: "Error al obtener los items del carrito" });
//   }
// };

// // ==========================================================
// // 📌 Agregar producto al carrito
// // ==========================================================
// export const addItemToCart = async (req, res) => {
//   try {
//     const { idCarrito, idProducto, cantidad = 1 } = req.body;

//     if (!idCarrito || !idProducto) {
//       return res
//         .status(400)
//         .json({ error: "idCarrito e idProducto son obligatorios" });
//     }

//     if (cantidad <= 0) {
//       return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
//     }

//     const cart = await Carrito.findByPk(idCarrito);
//     if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

//     const product = await Producto.findByPk(idProducto); // ← singular
//     if (!product)
//       return res.status(404).json({ error: "Producto no encontrado" });

//     if (product.stock < cantidad) {
//       return res.status(400).json({
//         error: "Stock insuficiente",
//         stockDisponible: product.stock,
//       });
//     }

//     const existingItem = await ItemsCarrito.findOne({
//       where: { idCarrito, idProducto },
//     });

//     if (existingItem) {
//       const nuevaCantidad = existingItem.cantidad + cantidad;

//       if (product.stock < nuevaCantidad) {
//         return res.status(400).json({
//           error: "Stock insuficiente para la cantidad solicitada",
//           stockDisponible: product.stock,
//           cantidadActualEnCarrito: existingItem.cantidad,
//         });
//       }

//       existingItem.cantidad = nuevaCantidad;
//       await existingItem.save();
//       await cart.update({ fechaActualizacion: new Date() });

//       return res.json({
//         success: true,
//         message: "Cantidad actualizada",
//         item: existingItem,
//       });
//     }

//     const newItem = await ItemsCarrito.create({
//       idCarrito,
//       idProducto,
//       cantidad,
//       precioUnitario: product.precioVenta,
//     });

//     await cart.update({ fechaActualizacion: new Date() });

//     return res.status(201).json({
//       success: true,
//       message: "Producto agregado al carrito",
//       item: newItem,
//     });
//   } catch (error) {
//     console.error("❌ Error en addItemToCart:", error.message);
//     return res.status(500).json({ error: "Error al agregar item al carrito" });
//   }
// };

// // ==========================================================
// // 📌 Actualizar cantidad de un item
// // ==========================================================
// export const updateItemQuantity = async (req, res) => {
//   try {
//     const { idItemCarrito } = req.params;
//     const { cantidad } = req.body;

//     if (!cantidad || cantidad <= 0) {
//       return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
//     }

//     const item = await ItemsCarrito.findByPk(idItemCarrito);
//     if (!item) return res.status(404).json({ error: "Item no encontrado" });

//     const product = await Producto.findByPk(item.idProducto); // ← singular
//     if (!product)
//       return res.status(404).json({ error: "Producto no encontrado" });

//     if (product.stock < cantidad) {
//       return res.status(400).json({
//         error: "Stock insuficiente",
//         stockDisponible: product.stock,
//       });
//     }

//     item.cantidad = cantidad;
//     await item.save();

//     const cart = await Carrito.findByPk(item.idCarrito);
//     if (cart) await cart.update({ fechaActualizacion: new Date() });

//     return res.json({
//       success: true,
//       message: "Cantidad actualizada",
//       item,
//     });
//   } catch (error) {
//     console.error("❌ Error en updateItemQuantity:", error.message);
//     return res.status(500).json({ error: "Error al actualizar item" });
//   }
// };

// // ==========================================================
// // 📌 Eliminar item del carrito
// // ==========================================================
// export const deleteItem = async (req, res) => {
//   try {
//     const { idItemCarrito } = req.params;

//     const item = await ItemsCarrito.findByPk(idItemCarrito);
//     if (!item) return res.status(404).json({ error: "Item no encontrado" });

//     const idCarrito = item.idCarrito;

//     await item.destroy();

//     const cart = await Carrito.findByPk(idCarrito);
//     if (cart) await cart.update({ fechaActualizacion: new Date() });

//     return res.json({ success: true, message: "Item eliminado" });
//   } catch (error) {
//     console.error("❌ Error en deleteItem:", error.message);
//     return res
//       .status(500)
//       .json({ error: "Error al eliminar item del carrito" });
//   }
// };

// // ==========================================================
// // 📌 Vaciar carrito
// // ==========================================================
// export const clearCart = async (req, res) => {
//   try {
//     const { idCarrito } = req.params;

//     const cart = await Carrito.findByPk(idCarrito);
//     if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

//     const deletedCount = await ItemsCarrito.destroy({ where: { idCarrito } });

//     await cart.update({ fechaActualizacion: new Date() });

//     return res.json({
//       success: true,
//       message: "Carrito vaciado",
//       itemsEliminados: deletedCount,
//     });
//   } catch (error) {
//     console.error("❌ Error en clearCart:", error.message);
//     return res.status(500).json({ error: "Error al vaciar el carrito" });
//   }
// };

