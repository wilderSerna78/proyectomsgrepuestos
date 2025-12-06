// src/controllers/order.controllers.js
import db from "../models/index.model.js";

// Usa los nombres correctos en singular
const { Orden, OrdenItem, Producto } = db;

// --------------------------------------------------------
// Crear una nueva orden
// --------------------------------------------------------
export const createOrder = async (req, res) => {
  const { idUsuario, items: productos } = req.body;

  try {
    // 1. Calcular subtotal, impuesto y total
    const subtotal = productos.reduce(
      (acc, p) => acc + p.precioUnitario * p.cantidad,
      0
    );
    const impuesto = subtotal * 0.19; // ejemplo: IVA 19%
    const total = subtotal + impuesto;

    // 2. Crear la orden
    const nuevaOrden = await Orden.create({
      idUsuario,
      subtotal,
      impuesto,
      total,
      fecha: new Date(),
      idEstado: 1, // estado inicial: pendiente
    });

    // 3. Registrar los ítems de la orden
    for (const producto of productos) {
      await OrdenItem.create({
        idOrden: nuevaOrden.idOrden,
        idProducto: producto.idProducto,
        cantidad: producto.cantidad,
        precioUnitario: producto.precioUnitario,
        subtotal: producto.precioUnitario * producto.cantidad,
      });

      // (Opcional) Actualizar stock del producto
      await Producto.decrement("stock", {
        by: producto.cantidad,
        where: { idProducto: producto.idProducto },
      });
    }

    // 4. Devolver la orden con sus ítems
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

    res.status(201).json({
      message: "Orden creada exitosamente",
      orden: ordenCompleta,
    });
  } catch (error) {
    console.error("❌ Error al crear la orden:", error.message);
    res
      .status(500)
      .json({ message: "Error al crear la orden", error: error.message });
  }
};

// --------------------------------------------------------
// Obtener orden por ID
// --------------------------------------------------------
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const orden = await Orden.findOne({
      where: { idOrden: id },
      include: [
        {
          model: OrdenItem,
          as: "items",
          include: [{ model: Producto, as: "producto" }],
        },
      ],
    });

    if (!orden) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json(orden);
  } catch (error) {
    console.error("❌ Error al obtener la orden:", error.message);
    res
      .status(500)
      .json({ message: "Error al obtener la orden", error: error.message });
  }
};

// --------------------------------------------------------
// Obtener todas las órdenes de un usuario
// --------------------------------------------------------
export const getOrdersByUser = async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const ordenes = await Orden.findAll({
      where: { idUsuario },
      include: [
        {
          model: OrdenItem,
          as: "items",
          include: [{ model: Producto, as: "producto" }],
        },
      ],
    });

    res.json(ordenes);
  } catch (error) {
    console.error(
      "❌ Error al obtener las órdenes del usuario:",
      error.message
    );
    res
      .status(500)
      .json({ message: "Error al obtener las órdenes", error: error.message });
  }
};

// // src/controllers/order.controllers.js
// import db from "../models/index.js";

// const { Ordenes, OrdenItems, Producto } = db;

// // Crear una nueva orden
// export const createOrder = async (req, res) => {
//   const { idUsuario, productos } = req.body;

//   try {
//     // 1. Calcular subtotal, impuesto y total
//     const subtotal = productos.reduce(
//       (acc, p) => acc + p.precioUnitario * p.cantidad,
//       0
//     );
//     const impuesto = subtotal * 0.19; // ejemplo: IVA 19%
//     const total = subtotal + impuesto;

//     // 2. Crear la orden
//     const nuevaOrden = await Ordenes.create({
//       idUsuario,
//       subtotal,
//       impuesto,
//       total,
//       fecha: new Date(),
//       idEstado: 1, // estado inicial: pendiente
//     });

//     // 3. Registrar los ítems de la orden
//     for (const producto of productos) {
//       await OrdenItems.create({
//         idOrden: nuevaOrden.idOrden,
//         idProducto: producto.idProducto,
//         cantidad: producto.cantidad,
//         precioUnitario: producto.precioUnitario,
//         subtotal: producto.precioUnitario * producto.cantidad,
//       });

//       // (Opcional) Actualizar stock del producto
//       await Producto.decrement("stock", {
//         by: producto.cantidad,
//         where: { idProducto: producto.idProducto },
//       });
//     }

//     // 4. Devolver la orden con sus ítems
//     const ordenCompleta = await Ordenes.findOne({
//       where: { idOrden: nuevaOrden.idOrden },
//       include: [
//         {
//           model: OrdenItems,
//           as: "items",
//           include: [{ model: Producto, as: "producto" }],
//         },
//       ],
//     });

//     res.status(201).json({
//       message: "Orden creada exitosamente",
//       orden: ordenCompleta,
//     });
//   } catch (error) {
//     console.error("Error al crear la orden:", error);
//     res.status(500).json({ message: "Error al crear la orden", error });
//   }
// };

// // Obtener orden por ID
// export const getOrderById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const orden = await Ordenes.findOne({
//       where: { idOrden: id },
//       include: [
//         {
//           model: OrdenItems,
//           as: "items",
//           include: [{ model: Producto, as: "producto" }],
//         },
//       ],
//     });

//     if (!orden) {
//       return res.status(404).json({ message: "Orden no encontrada" });
//     }

//     res.json(orden);
//   } catch (error) {
//     console.error("Error al obtener la orden:", error);
//     res.status(500).json({ message: "Error al obtener la orden", error });
//   }
// };

// // Obtener todas las órdenes de un usuario
// export const getOrdersByUser = async (req, res) => {
//   const { idUsuario } = req.params;

//   try {
//     const ordenes = await Ordenes.findAll({
//       where: { idUsuario },
//       include: [
//         {
//           model: OrdenItems,
//           as: "items",
//           include: [{ model: Producto, as: "producto" }],
//         },
//       ],
//     });

//     res.json(ordenes);
//   } catch (error) {
//     console.error("Error al obtener las órdenes del usuario:", error);
//     res.status(500).json({ message: "Error al obtener las órdenes", error });
//   }
// };
