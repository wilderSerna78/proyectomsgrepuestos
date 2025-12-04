// src/controllers/itemsCart.controllers.js

import db from "../models/index.model.js";

const { ItemsCarrito, Carrito, Productos } = db;

// ==========================================================
// 📌 Obtener todos los items de un carrito
// ==========================================================
export const getItemsByCart = async (req, res) => {
  try {
    const { idCarrito } = req.params;

    if (!ItemsCarrito) {
      console.error("❌ ERROR: ItemsCarrito no está definido en db.");
      return res
        .status(500)
        .json({ error: "Error interno: Modelo ItemsCarrito no encontrado" });
    }

    const cart = await Carrito.findByPk(idCarrito);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const items = await ItemsCarrito.findAll({
      where: { idCarrito },
      include: [
        {
          model: Productos,
          as: "producto",
          attributes: [
            "idProducto",
            "nombreProducto",
            "precioVenta",
            "imagen",
            "stock",
          ],
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
    return res
      .status(500)
      .json({ error: "Error al obtener los items del carrito" });
  }
};

// ==========================================================
// 📌 Agregar producto al carrito
// ==========================================================
export const addItemToCart = async (req, res) => {
  try {
    const { idCarrito, idProducto, cantidad = 1 } = req.body;

    if (!idCarrito || !idProducto) {
      return res
        .status(400)
        .json({ error: "idCarrito e idProducto son obligatorios" });
    }

    if (cantidad <= 0) {
      return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
    }

    const cart = await Carrito.findByPk(idCarrito);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const product = await Productos.findByPk(idProducto);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    if (product.stock < cantidad) {
      return res.status(400).json({
        error: "Stock insuficiente",
        stockDisponible: product.stock,
      });
    }

    // Buscar si ya existe este producto en el carrito
    const existingItem = await ItemsCarrito.findOne({
      where: { idCarrito, idProducto },
    });

    if (existingItem) {
      const nuevaCantidad = existingItem.cantidad + cantidad;

      if (product.stock < nuevaCantidad) {
        return res.status(400).json({
          error: "Stock insuficiente para la cantidad solicitada",
          stockDisponible: product.stock,
          cantidadActualEnCarrito: existingItem.cantidad,
        });
      }

      existingItem.cantidad = nuevaCantidad;
      await existingItem.save();
      await cart.update({ fechaActualizacion: new Date() });

      return res.json({
        success: true,
        message: "Cantidad actualizada",
        item: existingItem,
      });
    }

    // Crear nuevo item
    const newItem = await ItemsCarrito.create({
      idCarrito,
      idProducto,
      cantidad,
      precioUnitario: product.precioVenta,
    });

    await cart.update({ fechaActualizacion: new Date() });

    return res.status(201).json({
      success: true,
      message: "Producto agregado al carrito",
      item: newItem,
    });
  } catch (error) {
    console.error("❌ Error en addItemToCart:", error);
    return res.status(500).json({ error: "Error al agregar item al carrito" });
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
      return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
    }

    const item = await ItemsCarrito.findByPk(idItemCarrito);
    if (!item) return res.status(404).json({ error: "Item no encontrado" });

    const product = await Productos.findByPk(item.idProducto);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    if (product.stock < cantidad) {
      return res.status(400).json({
        error: "Stock insuficiente",
        stockDisponible: product.stock,
      });
    }

    item.cantidad = cantidad;
    await item.save();

    const cart = await Carrito.findByPk(item.idCarrito);
    if (cart) await cart.update({ fechaActualizacion: new Date() });

    return res.json({
      success: true,
      message: "Cantidad actualizada",
      item,
    });
  } catch (error) {
    console.error("❌ Error en updateItemQuantity:", error);
    return res.status(500).json({ error: "Error al actualizar item" });
  }
};

// ==========================================================
// 📌 Eliminar item del carrito
// ==========================================================
export const deleteItem = async (req, res) => {
  try {
    const { idItemCarrito } = req.params;

    const item = await ItemsCarrito.findByPk(idItemCarrito);
    if (!item) return res.status(404).json({ error: "Item no encontrado" });

    const idCarrito = item.idCarrito;

    await item.destroy();

    const cart = await Carrito.findByPk(idCarrito);
    if (cart) await cart.update({ fechaActualizacion: new Date() });

    return res.json({ success: true, message: "Item eliminado" });
  } catch (error) {
    console.error("❌ Error en deleteItem:", error);
    return res
      .status(500)
      .json({ error: "Error al eliminar item del carrito" });
  }
};

// ==========================================================
// 📌 Vaciar carrito
// ==========================================================
export const clearCart = async (req, res) => {
  try {
    const { idCarrito } = req.params;

    const cart = await Carrito.findByPk(idCarrito);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const deletedCount = await ItemsCarrito.destroy({ where: { idCarrito } });

    await cart.update({ fechaActualizacion: new Date() });

    return res.json({
      success: true,
      message: "Carrito vaciado",
      itemsEliminados: deletedCount,
    });
  } catch (error) {
    console.error("❌ Error en clearCart:", error);
    return res.status(500).json({ error: "Error al vaciar el carrito" });
  }
};

// // src/controllers/itemsCart.controllers.js

// import db from "../models/index.js";

// const { ItemsCart, Carrito, Productos } = db;

// // ------------------------------------------------------------
// // 📌 Obtener todos los items de un carrito
// // GET /api/items-cart/cart/:idCarrito
// // ------------------------------------------------------------
// export const getItemsByCart = async (req, res) => {
//   try {
//     const { idCarrito } = req.params;

//     // Verificar que el carrito existe
//     const cart = await Carrito.findByPk(idCarrito);
//     if (!cart) {
//       return res.status(404).json({ error: "Carrito no encontrado" });
//     }

//     const items = await ItemsCart.findAll({
//       where: { idCarrito },
//       include: [
//         {
//           model: Productos,
//           as: "producto",
//           attributes: ["idProducto", "nombreProducto", "precioVenta", "imagen", "stock"]
//         },
//       ],
//     });

//     res.json({
//       success: true,
//       count: items.length,
//       data: items
//     });

//   } catch (error) {
//     console.error("Error al obtener items:", error);
//     res.status(500).json({ error: "Error al obtener los items del carrito" });
//   }
// };

// // ------------------------------------------------------------
// // 📌 Agregar un producto al carrito
// // POST /api/items-cart
// // body: { idCarrito, idProducto, cantidad }
// // ------------------------------------------------------------
// export const addItemToCart = async (req, res) => {
//   try {
//     const { idCarrito, idProducto, cantidad } = req.body;

//     // Validaciones
//     if (!idCarrito || !idProducto) {
//       return res.status(400).json({ error: "idCarrito e idProducto son obligatorios" });
//     }

//     const cantidadFinal = cantidad || 1;

//     if (cantidadFinal <= 0) {
//       return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
//     }

//     // Verificar que el carrito existe
//     const cart = await Carrito.findByPk(idCarrito);
//     if (!cart) {
//       return res.status(404).json({ error: "Carrito no encontrado" });
//     }

//     // Verificar que el producto existe
//     const product = await Productos.findByPk(idProducto);
//     if (!product) {
//       return res.status(404).json({ error: "Producto no encontrado" });
//     }

//     // Verificar stock disponible
//     if (product.stock < cantidadFinal) {
//       return res.status(400).json({
//         error: "Stock insuficiente",
//         stockDisponible: product.stock
//       });
//     }

//     // Verificar si el item ya existe
//     const existingItem = await ItemsCart.findOne({
//       where: { idCarrito, idProducto },
//     });

//     if (existingItem) {
//       const nuevaCantidad = existingItem.cantidad + cantidadFinal;

//       // Verificar stock para la nueva cantidad
//       if (product.stock < nuevaCantidad) {
//         return res.status(400).json({
//           error: "Stock insuficiente para la cantidad solicitada",
//           stockDisponible: product.stock,
//           cantidadActualEnCarrito: existingItem.cantidad
//         });
//       }

//       existingItem.cantidad = nuevaCantidad;
//       await existingItem.save();

//       // Actualizar fecha del carrito
//       await cart.update({ fechaActualizacion: new Date() });

//       return res.json({
//         success: true,
//         message: "Cantidad actualizada",
//         item: existingItem,
//       });
//     }

//     // Crear nuevo item
//     const newItem = await ItemsCart.create({
//       idCarrito,
//       idProducto,
//       cantidad: cantidadFinal,
//     });

//     // Actualizar fecha del carrito
//     await cart.update({ fechaActualizacion: new Date() });

//     res.status(201).json({
//       success: true,
//       message: "Producto agregado al carrito",
//       item: newItem,
//     });

//   } catch (error) {
//     console.error("Error al agregar item:", error);
//     res.status(500).json({ error: "Error al agregar item al carrito" });
//   }
// };

// // ------------------------------------------------------------
// // 📌 Actualizar cantidad de un item
// // PUT /api/items-cart/:idItem
// // body: { cantidad }
// // ------------------------------------------------------------
// export const updateItemQuantity = async (req, res) => {
//   try {
//     const { idItem } = req.params;
//     const { cantidad } = req.body;

//     // Validaciones
//     if (!cantidad || cantidad <= 0) {
//       return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
//     }

//     const item = await ItemsCart.findByPk(idItem);

//     if (!item) {
//       return res.status(404).json({ error: "Item no encontrado" });
//     }

//     // Verificar stock del producto
//     const product = await Productos.findByPk(item.idProducto);
//     if (!product) {
//       return res.status(404).json({ error: "Producto no encontrado" });
//     }

//     if (product.stock < cantidad) {
//       return res.status(400).json({
//         error: "Stock insuficiente",
//         stockDisponible: product.stock
//       });
//     }

//     item.cantidad = cantidad;
//     await item.save();

//     // Actualizar fecha del carrito
//     const cart = await Carrito.findByPk(item.idCarrito);
//     if (cart) {
//       await cart.update({ fechaActualizacion: new Date() });
//     }

//     res.json({
//       success: true,
//       message: "Cantidad actualizada",
//       item,
//     });

//   } catch (error) {
//     console.error("Error al actualizar cantidad:", error);
//     res.status(500).json({ error: "Error al actualizar item" });
//   }
// };

// // ------------------------------------------------------------
// // 📌 Eliminar un item del carrito
// // DELETE /api/items-cart/:idItem
// // ------------------------------------------------------------
// export const deleteItem = async (req, res) => {
//   try {
//     const { idItem } = req.params;

//     const item = await ItemsCart.findByPk(idItem);

//     if (!item) {
//       return res.status(404).json({ error: "Item no encontrado" });
//     }

//     const idCarrito = item.idCarrito;

//     await item.destroy();

//     // Actualizar fecha del carrito
//     const cart = await Carrito.findByPk(idCarrito);
//     if (cart) {
//       await cart.update({ fechaActualizacion: new Date() });
//     }

//     res.json({
//       success: true,
//       message: "Item eliminado"
//     });

//   } catch (error) {
//     console.error("Error al eliminar item:", error);
//     res.status(500).json({ error: "Error al eliminar item del carrito" });
//   }
// };

// // ------------------------------------------------------------
// // 📌 Vaciar carrito completo
// // DELETE /api/items-cart/cart/:idCarrito
// // ------------------------------------------------------------
// export const clearCart = async (req, res) => {
//   try {
//     const { idCarrito } = req.params;

//     // Verificar que el carrito existe
//     const cart = await Carrito.findByPk(idCarrito);
//     if (!cart) {
//       return res.status(404).json({ error: "Carrito no encontrado" });
//     }

//     const deletedCount = await ItemsCart.destroy({
//       where: { idCarrito },
//     });

//     // Actualizar fecha del carrito
//     await cart.update({ fechaActualizacion: new Date() });

//     res.json({
//       success: true,
//       message: "Carrito vaciado",
//       itemsEliminados: deletedCount
//     });

//   } catch (error) {
//     console.error("Error al vaciar carrito:", error);
//     res.status(500).json({ error: "Error al vaciar el carrito" });
//   }
// };
