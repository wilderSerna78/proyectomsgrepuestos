import db from "../models/index.model.js";

const { Carrito, Usuario, ItemsCarrito, Producto } = db;

// Constante para el rol de cliente
const ID_ROL_CLIENTE = 4;

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
    console.error("❌ Error al crear carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

// --- NUEVA FUNCIÓN ---
// --------------------------------------------------------
// Obtener TODOS los carritos (Ideal para administradores)
// --------------------------------------------------------
export const getAllCarts = async (req, res) => {
  try {
    const carts = await Carrito.findAll({
      // Incluir las relaciones (usuario y sus ítems) para obtener la vista completa
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["idUsuario", "nombre", "email"],
        },
        {
          model: ItemsCarrito,
          as: "items",
          include: [
            {
              model: Producto,
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
        },
      ],
      order: [
        ['fechaActualizacion', 'DESC'] // Opcional: ordenar por fecha de actualización
      ]
    });

    if (!carts || carts.length === 0) {
      return res.status(404).json({ error: "No se encontraron carritos." });
    }

    return res.json({ success: true, count: carts.length, data: carts });
  } catch (error) {
    console.error("❌ Error al obtener todos los carritos:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};
// --- FIN NUEVA FUNCIÓN ---

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
          as: "items",
          include: [
            {
              model: Producto,
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
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    return res.json({ success: true, data: cart });
  } catch (error) {
    console.error("❌ Error al obtener carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

// --------------------------------------------------------
// Agregar producto al carrito
// --------------------------------------------------------
export const addProductToCart = async (req, res) => {
  try {
    const { idUsuario, idRol } = req.user; // middleware debe llenar req.user
    const { idProducto, cantidad } = req.body;

    if (!idUsuario || idRol !== ID_ROL_CLIENTE) {
      return res.status(403).json({
        error: "Acceso denegado. Solo clientes pueden agregar productos.",
      });
    }

    if (!idProducto || !cantidad || cantidad <= 0) {
      return res.status(400).json({
        error: "Datos incompletos o inválidos. Se requiere idProducto y cantidad > 0.",
      });
    }

    let cart = await Carrito.findOne({ where: { idUsuario } });
    if (!cart) {
      cart = await Carrito.create({
        idUsuario,
        fechaActualizacion: new Date(),
      });
    }

    const idCarrito = cart.idCarrito;

    const product = await Producto.findByPk(idProducto);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

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

      return res.json({ message: "Cantidad actualizada.", item: existingItem });
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
    console.error("❌ Error al agregar producto:", error);
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

    return res.json({ success: true, message: "Item eliminado del carrito." });
  } catch (error) {
    console.error("❌ Error al eliminar item:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

// --------------------------------------------------------
// Vaciar carrito completo
// --------------------------------------------------------
export const emptyCart = async (req, res) => {
  try {
    const { idCarrito } = req.params;

    const cart = await Carrito.findByPk(idCarrito);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado." });

    await ItemsCarrito.destroy({ where: { idCarrito } });
    await cart.update({ fechaActualizacion: new Date() });

    return res.json({ success: true, message: "Carrito vaciado." });
  } catch (error) {
    console.error("❌ Error al vaciar carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};


// // src/controllers/carts.controllers.js
// import db from "../models/index.model.js";

// const { Carrito, Usuario, ItemsCarrito, Producto } = db;

// // Constante para el rol de cliente
// const ID_ROL_CLIENTE = 4;

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
//       fechaActualizacion: new Date(),
//     });

//     return res.status(201).json({
//       message: "Carrito creado exitosamente.",
//       cart: newCart,
//     });
//   } catch (error) {
//     console.error("❌ Error al crear carrito:", error);
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
//           model: ItemsCarrito,
//           as: "items",
//           include: [
//             {
//               model: Producto,
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

//     return res.json({ success: true, data: cart });
//   } catch (error) {
//     console.error("❌ Error al obtener carrito:", error);
//     return res.status(500).json({ error: "Error interno del servidor." });
//   }
// };

// // --------------------------------------------------------
// // Agregar producto al carrito
// // --------------------------------------------------------
// export const addProductToCart = async (req, res) => {
//   try {
//     const { idUsuario, idRol } = req.user; // middleware debe llenar req.user
//     const { idProducto, cantidad } = req.body;

//     if (!idUsuario || idRol !== ID_ROL_CLIENTE) {
//       return res.status(403).json({
//         error: "Acceso denegado. Solo clientes pueden agregar productos.",
//       });
//     }

//     if (!idProducto || !cantidad || cantidad <= 0) {
//       return res.status(400).json({
//         error: "Datos incompletos o inválidos. Se requiere idProducto y cantidad > 0.",
//       });
//     }

//     let cart = await Carrito.findOne({ where: { idUsuario } });
//     if (!cart) {
//       cart = await Carrito.create({
//         idUsuario,
//         fechaActualizacion: new Date(),
//       });
//     }

//     const idCarrito = cart.idCarrito;

//     const product = await Producto.findByPk(idProducto);
//     if (!product) {
//       return res.status(404).json({ error: "Producto no encontrado." });
//     }

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

//       return res.json({ message: "Cantidad actualizada.", item: existingItem });
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
//     console.error("❌ Error al agregar producto:", error);
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

//     return res.json({ success: true, message: "Item eliminado del carrito." });
//   } catch (error) {
//     console.error("❌ Error al eliminar item:", error);
//     return res.status(500).json({ error: "Error interno del servidor." });
//   }
// };

// // --------------------------------------------------------
// // Vaciar carrito completo
// // --------------------------------------------------------
// export const emptyCart = async (req, res) => {
//   try {
//     const { idCarrito } = req.params;

//     const cart = await Carrito.findByPk(idCarrito);
//     if (!cart) return res.status(404).json({ error: "Carrito no encontrado." });

//     await ItemsCarrito.destroy({ where: { idCarrito } });
//     await cart.update({ fechaActualizacion: new Date() });

//     return res.json({ success: true, message: "Carrito vaciado." });
//   } catch (error) {
//     console.error("❌ Error al vaciar carrito:", error);
//     return res.status(500).json({ error: "Error interno del servidor." });
//   }
// };

