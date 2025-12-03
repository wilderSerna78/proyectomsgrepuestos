// --- products.controllers.js ---
import { Product } from "../models/product.model.js"; 

/* ============================================================
   🟩 CONTROLADOR: Crear un nuevo producto
   ------------------------------------------------------------
   @route   POST /api/v1/products
   @access  Private/Admin
   @desc    Registra un nuevo producto en la base de datos.
   ============================================================ */
export const createProductController = async (req, res) => {
    try {
        const productData = req.body;

        // Inserta el producto a través del modelo
        const result = await Product.createProduct(productData);

        res.status(201).json({
            success: true,
            message: "Producto creado exitosamente.",
            id: result.idProducto
        });

    } catch (error) {
        console.error("❌ Error al crear producto:", error.message);
        res.status(500).json({
            success: false,
            message: "Fallo al crear el producto.",
            error: error.message
        });
    }
};



/* ============================================================
   🟦 CONTROLADOR: Consultar todos los productos
   ------------------------------------------------------------
   @route   GET /api/v1/products
   @access  Public
   @desc    Obtiene la lista completa de productos con filtros
            opcionales (ej: nombre, marca, categoría, etc.).
   ============================================================ */
export const getAllProductsController = async (req, res) => {
    try {
        const filters = req.query;

        const products = await Product.getAllProducts(filters);

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        console.error("❌ Error al obtener productos:", error.message);
        res.status(500).json({
            success: false,
            message: "Fallo al obtener la lista de productos.",
            error: error.message
        });
    }
};



/* ============================================================
   🟨 CONTROLADOR: Consultar producto por ID
   ------------------------------------------------------------
   @route   GET /api/v1/products/:id
   @access  Public
   @desc    Devuelve la información de un producto específico
            según su identificador.
   ============================================================ */
export const getProductByIdController = async (req, res) => {
    try {
        const idProducto = parseInt(req.params.id);

        if (isNaN(idProducto)) {
            return res.status(400).json({
                success: false,
                message: "ID de producto inválido."
            });
        }
        
        const product = await Product.getProductById(idProducto);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado."
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error("❌ Error al buscar producto por ID:", error.message);
        res.status(500).json({
            success: false,
            message: "Fallo al obtener el producto."
        });
    }
};



/* ============================================================
   🟧 CONTROLADOR: Actualizar un producto
   ------------------------------------------------------------
   @route   PUT /api/v1/products/:id
   @access  Private/Admin
   @desc    Modifica la información de un producto existente.
   ============================================================ */
export const updateProductController = async (req, res) => {
    try {
        const idProducto = parseInt(req.params.id);
        const productData = req.body;

        if (isNaN(idProducto)) {
            return res.status(400).json({
                success: false,
                message: "ID de producto inválido."
            });
        }

        const affectedRows = await Product.updateProduct(idProducto, productData);

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado o no se proporcionaron datos válidos."
            });
        }

        res.status(200).json({
            success: true,
            message: "Producto actualizado exitosamente."
        });

    } catch (error) {
        console.error("❌ Error al actualizar producto:", error.message);
        res.status(500).json({
            success: false,
            message: "Fallo al actualizar el producto.",
            error: error.message
        });
    }
};



/* ============================================================
   🟥 CONTROLADOR: Eliminar un producto por ID
   ------------------------------------------------------------
   @route   DELETE /api/v1/products/:id
   @access  Private/Admin
   @desc    Elimina un producto de la base de datos.
            Si está referenciado por otra tabla, devuelve error 409.
   ============================================================ */
export const deleteProductController = async (req, res) => {
    try {
        const idProducto = parseInt(req.params.id);

        if (isNaN(idProducto)) {
            return res.status(400).json({
                success: false,
                message: "ID de producto inválido."
            });
        }

        const affectedRows = await Product.deleteProduct(idProducto);

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado."
            });
        }

        res.status(200).json({
            success: true,
            message: "Producto eliminado exitosamente."
        });

    } catch (error) {
        console.error("❌ Error al eliminar producto:", error.message);

        // Detecta conflicto por llave foránea
        const statusCode = error.message.includes("referenciado") ? 409 : 500;

        res.status(statusCode).json({
            success: false,
            message: "Fallo al eliminar el producto.",
            error: error.message
        });
    }
};
