// src/controller/carts.controllers.js
import db from "../models/index.model.js";

// Usa los nombres correctos en singular
const { Carrito, Usuario, ItemsCarrito, Producto } = db;

// --------------------------------------------------------
// Crear carrito para un usuario
// --------------------------------------------------------
export const createCart = async (req, res) => {
  try {
    const { idUsuario } = req.body;

    if (!idUsuario) {
      return res.status(400).json({ error: "El idUsuario es obligatorio." });
    }

    const existingCart = await Carrito.findOne({ where: { idUsuario } });

    if (existingCart) {
      return res.status(409).json({
        error: "El usuario ya tiene un carrito.",
        cart: existingCart,
      });
    }

    const newCart = await Carrito.create({
      idUsuario,
      fechaActualizacion: new Date(),
    });

    return res.status(201).json({
      message: "Carrito creado exitosamente.",
      cart: newCart,
    });
  } catch (error) {
    console.error("Error al crear carrito:", error.message);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

// --------------------------------------------------------
// Obtener carrito por ID
// --------------------------------------------------------
export const getCartById = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Carrito.findOne({
      where: { idCarrito: id },
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["idUsuario", "nombre", "email"],
        },
        {
          model: ItemsCarrito,
          as: "items", // debe coincidir con Carrito.hasMany(..., as: "items")
          include: [
            {
              model: Producto, // ← singular
              as: "producto",  // ← alias definido en ItemsCarrito.belongsTo
              attributes: [
                "idProducto",
                "nombreProducto",
                "precioVenta",
                "imagen",
                "stock",
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    return res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error al obtener carrito:", error.message);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

// --------------------------------------------------------
// Agregar producto al carrito
// --------------------------------------------------------
export const addProductToCart = async (req, res) => {
  try {
    const { idCarrito, idProducto, cantidad } = req.body;

    if (!idCarrito || !idProducto || !cantidad) {
      return res.status(400).json({ error: "Datos incompletos." });
    }

    const cart = await Carrito.findByPk(idCarrito);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado." });

    const product = await Producto.findByPk(idProducto); // ← singular
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado." });

    if (product.stock < cantidad) {
      return res.status(400).json({
        error: "Stock insuficiente.",
        stockDisponible: product.stock,
      });
    }

    const existingItem = await ItemsCarrito.findOne({
      where: { idCarrito, idProducto },
    });

    if (existingItem) {
      const nuevaCantidad = existingItem.cantidad + cantidad;
      if (product.stock < nuevaCantidad) {
        return res.status(400).json({
          error: "Stock insuficiente para la cantidad solicitada.",
          stockDisponible: product.stock,
          cantidadActualEnCarrito: existingItem.cantidad,
        });
      }

      existingItem.cantidad = nuevaCantidad;
      await existingItem.save();
      await cart.update({ fechaActualizacion: new Date() });

      return res.json({
        message: "Cantidad actualizada.",
        item: existingItem,
      });
    }

    const newItem = await ItemsCarrito.create({
      idCarrito,
      idProducto,
      cantidad,
      precioUnitario: product.precioVenta ?? null,
    });

    await cart.update({ fechaActualizacion: new Date() });

    return res.status(201).json({
      message: "Producto agregado al carrito.",
      item: newItem,
    });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error.message);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

// --------------------------------------------------------
// Eliminar producto del carrito
// --------------------------------------------------------
export const deleteItemFromCart = async (req, res) => {
  try {
    const { idItemCarrito } = req.params;

    const item = await ItemsCarrito.findByPk(idItemCarrito);
    if (!item) return res.status(404).json({ error: "Item no encontrado." });

    const cart = await Carrito.findByPk(item.idCarrito);
    if (cart) await cart.update({ fechaActualizacion: new Date() });

    await item.destroy();

    return res.json({
      success: true,
      message: "Item eliminado del carrito.",
    });
  } catch (error) {
    console.error("Error al eliminar item:", error.message);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

// --------------------------------------------------------
// Vaciar un carrito completo
// --------------------------------------------------------
export const emptyCart = async (req, res) => {
  try {
    const { idCarrito } = req.params;

    const cart = await Carrito.findByPk(idCarrito);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado." });

    await ItemsCarrito.destroy({ where: { idCarrito } });
    await cart.update({ fechaActualizacion: new Date() });

    return res.json({
      success: true,
      message: "El carrito fue vaciado.",
    });
  } catch (error) {
    console.error("Error al vaciar carrito:", error.message);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};


// // src/controller/carts.controllers.js
// import db from "../models/index.model.js";

// const { Carrito, Usuario, ItemsCarrito, Productos } = db;

// // --------------------------------------------------------
// // Crear carrito para un usuario
// // --------------------------------------------------------
// export const createCart = async (req, res) => {
//   try {
//     const { idUsuario } = req.body;

//     if (!idUsuario) {
//       return res.status(400).json({ error: "El idUsuario es obligatorio." });
//     }

//     const existingCart = await Carrito.findOne({ where: { idUsuario } });

//     if (existingCart) {
//       return res.status(409).json({
//         error: "El usuario ya tiene un carrito.",
//         cart: existingCart,
//       });
//     }

//     const newCart = await Carrito.create({
//       idUsuario,
//       fechaCreacion: new Date(),
//       fechaActualizacion: new Date(),
//     });

//     return res.status(201).json({
//       message: "Carrito creado exitosamente.",
//       cart: newCart,
//     });
//   } catch (error) {
//     console.error("Error al crear carrito:", error);
//     return res.status(500).json({ error: "Error interno del servidor." });
//   }
// };

// // --------------------------------------------------------
// // Obtener carrito por ID
// // --------------------------------------------------------
// export const getCartById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const cart = await Carrito.findOne({
//       where: { idCarrito: id },
//       include: [
//         {
//           model: Usuario,
//           as: "usuario",
//           attributes: ["idUsuario", "nombre", "email"],
//         },
//         {
//           model: ItemsCarrito, // <-- USAR ItemsCarrito (no ItemsCart)
//           as: "items", // debe coincidir con Carrito.hasMany(..., as: "items")
//           include: [
//             {
//               model: Productos,
//               as: "producto",
//               attributes: [
//                 "idProducto",
//                 "nombreProducto",
//                 "precioVenta",
//                 "imagen",
//                 "stock",
//               ],
//             },
//           ],
//         },
//       ],
//     });

//     if (!cart) {
//       return res.status(404).json({ error: "Carrito no encontrado." });
//     }

//     return res.json({
//       success: true,
//       data: cart,
//     });
//   } catch (error) {
//     console.error("Error al obtener carrito:", error);
//     return res.status(500).json({ error: "Error interno del servidor." });
//   }
// };

// // --------------------------------------------------------
// // Agregar producto al carrito
// // --------------------------------------------------------
// export const addProductToCart = async (req, res) => {
//   try {
//     const { idCarrito, idProducto, cantidad } = req.body;

//     if (!idCarrito || !idProducto || !cantidad) {
//       return res.status(400).json({ error: "Datos incompletos." });
//     }

//     const cart = await Carrito.findByPk(idCarrito);
//     if (!cart) return res.status(404).json({ error: "Carrito no encontrado." });

//     const product = await Productos.findByPk(idProducto);
//     if (!product)
//       return res.status(404).json({ error: "Producto no encontrado." });

//     if (product.stock < cantidad) {
//       return res.status(400).json({
//         error: "Stock insuficiente.",
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
//           error: "Stock insuficiente para la cantidad solicitada.",
//           stockDisponible: product.stock,
//           cantidadActualEnCarrito: existingItem.cantidad,
//         });
//       }

//       existingItem.cantidad = nuevaCantidad;
//       await existingItem.save();
//       await cart.update({ fechaActualizacion: new Date() });

//       return res.json({
//         message: "Cantidad actualizada.",
//         item: existingItem,
//       });
//     }

//     const newItem = await ItemsCarrito.create({
//       idCarrito,
//       idProducto,
//       cantidad,
//       precioUnitario: product.precioVenta ?? null,
//     });

//     await cart.update({ fechaActualizacion: new Date() });

//     return res.status(201).json({
//       message: "Producto agregado al carrito.",
//       item: newItem,
//     });
//   } catch (error) {
//     console.error("Error al agregar producto al carrito:", error);
//     return res.status(500).json({ error: "Error interno del servidor." });
//   }
// };

// // --------------------------------------------------------
// // Eliminar producto del carrito
// // --------------------------------------------------------
// export const deleteItemFromCart = async (req, res) => {
//   try {
//     const { idItemCarrito } = req.params;

//     const item = await ItemsCarrito.findByPk(idItemCarrito);
//     if (!item) return res.status(404).json({ error: "Item no encontrado." });

//     const cart = await Carrito.findByPk(item.idCarrito);
//     if (cart) await cart.update({ fechaActualizacion: new Date() });

//     await item.destroy();

//     return res.json({
//       success: true,
//       message: "Item eliminado del carrito.",
//     });
//   } catch (error) {
//     console.error("Error al eliminar item:", error);
//     return res.status(500).json({ error: "Error interno del servidor." });
//   }
// };

// // --------------------------------------------------------
// // Vaciar un carrito completo
// // --------------------------------------------------------
// export const emptyCart = async (req, res) => {
//   try {
//     const { idCarrito } = req.params;

//     const cart = await Carrito.findByPk(idCarrito);
//     if (!cart) return res.status(404).json({ error: "Carrito no encontrado." });

//     await ItemsCarrito.destroy({ where: { idCarrito } });
//     await cart.update({ fechaActualizacion: new Date() });

//     return res.json({
//       success: true,
//       message: "El carrito fue vaciado.",
//     });
//   } catch (error) {
//     console.error("Error al vaciar carrito:", error);
//     return res.status(500).json({ error: "Error interno del servidor." });
//   }
// };
