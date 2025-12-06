// --- products.controllers.js ---
import db from "../models/index.model.js";

// Usa el nombre correcto en singular
const { Producto, Categoria, Estado } = db;

/* ============================================================
   🟩 CONTROLADOR: Crear un nuevo producto
   ============================================================ */
export const createProductController = async (req, res) => {
  try {
    const productData = req.body;

    const newProduct = await Producto.create(productData);

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente.",
      id: newProduct.idProducto,
      data: newProduct,
    });
  } catch (error) {
    console.error("❌ Error al crear producto:", error.message);
    res.status(500).json({
      success: false,
      message: "Fallo al crear el producto.",
      error: error.message,
    });
  }
};

/* ============================================================
   🟦 CONTROLADOR: Consultar todos los productos
   ============================================================ */
export const getAllProductsController = async (req, res) => {
  try {
    const { nombre, marca, categoriaId } = req.query;

    const where = {};
    if (nombre)
      where.nombreProducto = { [db.Sequelize.Op.like]: `%${nombre}%` };
    if (marca) where.marcaRepuesto = { [db.Sequelize.Op.like]: `%${marca}%` };
    if (categoriaId) where.idCategoria = categoriaId;

    const products = await Producto.findAll({
      where,
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["nombreCategoria"],
        },
        {
          model: Estado,
          as: "estado",
          attributes: ["nombre"],
        },
      ],
      order: [["nombreProducto", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("❌ Error al obtener productos:", error.message);
    res.status(500).json({
      success: false,
      message: "Fallo al obtener la lista de productos.",
      error: error.message,
    });
  }
};

/* ============================================================
   🟨 CONTROLADOR: Consultar producto por ID
   ============================================================ */
export const getProductByIdController = async (req, res) => {
  try {
    const idProducto = parseInt(req.params.id);

    if (isNaN(idProducto)) {
      return res.status(400).json({
        success: false,
        message: "ID de producto inválido.",
      });
    }

    const product = await Producto.findByPk(idProducto, {
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["nombreCategoria"],
        },
        {
          model: Estado,
          as: "estado",
          attributes: ["nombre"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado.",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("❌ Error al buscar producto por ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Fallo al obtener el producto.",
      error: error.message,
    });
  }
};

/* ============================================================
   🟧 CONTROLADOR: Actualizar un producto
   ============================================================ */
export const updateProductController = async (req, res) => {
  try {
    const idProducto = parseInt(req.params.id);
    const productData = req.body;

    if (isNaN(idProducto)) {
      return res.status(400).json({
        success: false,
        message: "ID de producto inválido.",
      });
    }

    const product = await Producto.findByPk(idProducto);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado.",
      });
    }

    await product.update(productData);

    res.status(200).json({
      success: true,
      message: "Producto actualizado exitosamente.",
      data: product,
    });
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error.message);
    res.status(500).json({
      success: false,
      message: "Fallo al actualizar el producto.",
      error: error.message,
    });
  }
};

/* ============================================================
   🟥 CONTROLADOR: Eliminar un producto por ID
   ============================================================ */
export const deleteProductController = async (req, res) => {
  try {
    const idProducto = parseInt(req.params.id);

    if (isNaN(idProducto)) {
      return res.status(400).json({
        success: false,
        message: "ID de producto inválido.",
      });
    }

    const product = await Producto.findByPk(idProducto);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado.",
      });
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: "Producto eliminado exitosamente.",
    });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error.message);

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({
        success: false,
        message:
          "No se pudo eliminar el producto. Está relacionado con otra tabla.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Fallo al eliminar el producto.",
      error: error.message,
    });
  }
};



// // --- products.controllers.js ---
// import db from "../models/index.model.js";

// const { Productos } = db;

// /* ============================================================
//    🟩 CONTROLADOR: Crear un nuevo producto
//    ------------------------------------------------------------
//    @route   POST /api/v1/products
//    @access  Private/Admin
//    @desc    Registra un nuevo producto en la base de datos.
//    ============================================================ */
// export const createProductController = async (req, res) => {
//   try {
//     const productData = req.body;

//     // Crear producto con Sequelize
//     const newProduct = await Productos.create(productData);

//     res.status(201).json({
//       success: true,
//       message: "Producto creado exitosamente.",
//       id: newProduct.idProducto,
//       data: newProduct,
//     });
//   } catch (error) {
//     console.error("❌ Error al crear producto:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Fallo al crear el producto.",
//       error: error.message,
//     });
//   }
// };

// /* ============================================================
//    🟦 CONTROLADOR: Consultar todos los productos
//    ------------------------------------------------------------
//    @route   GET /api/v1/products
//    @access  Public
//    @desc    Obtiene la lista completa de productos con filtros
//             opcionales (ej: nombre, marca, categoría, etc.).
//    ============================================================ */
// export const getAllProductsController = async (req, res) => {
//   try {
//     const { nombre, marca, categoriaId } = req.query;

//     // Construir filtros dinámicos
//     const where = {};
//     if (nombre)
//       where.nombreProducto = { [db.Sequelize.Op.like]: `%${nombre}%` };
//     if (marca) where.marcaRepuesto = { [db.Sequelize.Op.like]: `%${marca}%` };
//     if (categoriaId) where.idCategoria = categoriaId;

//     const products = await Productos.findAll({
//       where,
//       include: [
//         {
//           model: db.Categorias,
//           as: "categoria",
//           attributes: ["nombreCategoria"],
//         },
//         {
//           model: db.Estado,
//           as: "estado",
//           attributes: ["nombre"],
//         },
//       ],
//       order: [["nombreProducto", "ASC"]],
//     });

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       data: products,
//     });
//   } catch (error) {
//     console.error("❌ Error al obtener productos:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Fallo al obtener la lista de productos.",
//       error: error.message,
//     });
//   }
// };

// /* ============================================================
//    🟨 CONTROLADOR: Consultar producto por ID
//    ------------------------------------------------------------
//    @route   GET /api/v1/products/:id
//    @access  Public
//    @desc    Devuelve la información de un producto específico
//             según su identificador.
//    ============================================================ */
// export const getProductByIdController = async (req, res) => {
//   try {
//     const idProducto = parseInt(req.params.id);

//     if (isNaN(idProducto)) {
//       return res.status(400).json({
//         success: false,
//         message: "ID de producto inválido.",
//       });
//     }

//     const product = await Productos.findByPk(idProducto, {
//       include: [
//         {
//           model: db.Categorias,
//           as: "categoria",
//           attributes: ["nombreCategoria"],
//         },
//         {
//           model: db.Estado,
//           as: "estado",
//           attributes: ["nombre"],
//         },
//       ],
//     });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Producto no encontrado.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: product,
//     });
//   } catch (error) {
//     console.error("❌ Error al buscar producto por ID:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Fallo al obtener el producto.",
//     });
//   }
// };

// /* ============================================================
//    🟧 CONTROLADOR: Actualizar un producto
//    ------------------------------------------------------------
//    @route   PUT /api/v1/products/:id
//    @access  Private/Admin
//    @desc    Modifica la información de un producto existente.
//    ============================================================ */
// export const updateProductController = async (req, res) => {
//   try {
//     const idProducto = parseInt(req.params.id);
//     const productData = req.body;

//     if (isNaN(idProducto)) {
//       return res.status(400).json({
//         success: false,
//         message: "ID de producto inválido.",
//       });
//     }

//     const product = await Productos.findByPk(idProducto);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Producto no encontrado.",
//       });
//     }

//     await product.update(productData);

//     res.status(200).json({
//       success: true,
//       message: "Producto actualizado exitosamente.",
//       data: product,
//     });
//   } catch (error) {
//     console.error("❌ Error al actualizar producto:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Fallo al actualizar el producto.",
//       error: error.message,
//     });
//   }
// };

// /* ============================================================
//    🟥 CONTROLADOR: Eliminar un producto por ID
//    ------------------------------------------------------------
//    @route   DELETE /api/v1/products/:id
//    @access  Private/Admin
//    @desc    Elimina un producto de la base de datos.
//             Si está referenciado por otra tabla, devuelve error 409.
//    ============================================================ */
// export const deleteProductController = async (req, res) => {
//   try {
//     const idProducto = parseInt(req.params.id);

//     if (isNaN(idProducto)) {
//       return res.status(400).json({
//         success: false,
//         message: "ID de producto inválido.",
//       });
//     }

//     const product = await Productos.findByPk(idProducto);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Producto no encontrado.",
//       });
//     }

//     await product.destroy();

//     res.status(200).json({
//       success: true,
//       message: "Producto eliminado exitosamente.",
//     });
//   } catch (error) {
//     console.error("❌ Error al eliminar producto:", error.message);

//     // Detecta conflicto por llave foránea
//     if (error.name === "SequelizeForeignKeyConstraintError") {
//       return res.status(409).json({
//         success: false,
//         message:
//           "No se pudo eliminar el producto. Está relacionado con otra tabla.",
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Fallo al eliminar el producto.",
//       error: error.message,
//     });
//   }
// };
