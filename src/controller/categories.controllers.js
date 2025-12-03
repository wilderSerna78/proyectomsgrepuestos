// --------------------------------------------------------
// categories.controllers.js — Controlador para Categorías
// --------------------------------------------------------

import { Category } from "../models/category.model.js";   // ✔ CORRECTO



// --------------------------------------------------------
// C: CREAR CATEGORÍA
// --------------------------------------------------------
/**
 * Crea una nueva categoría.
 * @route POST /api/v1/categories
 * @access Private/Admin
 */
export const createCategoryController = async (req, res) => {
  try {
    const { nombreCategoria, descripcion } = req.body;

    // Validación simple
    if (!nombreCategoria) {
      return res.status(400).json({
        success: false,
        message: "El nombre de la categoría es obligatorio."
      });
    }

    // Crear categoría
    const newId = await Category.createCategory(nombreCategoria, descripcion);

    return res.status(201).json({
      success: true,
      message: "Categoría creada exitosamente.",
      idCategoria: newId
    });

  } catch (error) {
    console.error("Error en createCategoryController:", error.message);

    if (error.message.includes("ya existe")) {
      return res.status(409).json({ success: false, message: error.message });
    }

    return res.status(500).json({
      success: false,
      message: "Fallo al crear la categoría.",
      error: error.message
    });
  }
};


// --------------------------------------------------------
// R: OBTENER TODAS LAS CATEGORÍAS
// --------------------------------------------------------
/**
 * Obtiene todas las categorías registradas.
 * @route GET /api/v1/categories
 * @access Public
 */
export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {
    console.error("Error en getAllCategoriesController:", error.message);

    return res.status(500).json({
      success: false,
      message: "Fallo al obtener categorías.",
      error: error.message
    });
  }
};


// --------------------------------------------------------
// R: OBTENER CATEGORÍA POR ID
// --------------------------------------------------------
/**
 * Obtiene una categoría específica usando su ID.
 * @route GET /api/v1/categories/:id
 * @access Public
 */
export const getCategoryByIdController = async (req, res) => {
  try {
    const idCategoria = Number(req.params.id);

    if (isNaN(idCategoria)) {
      return res.status(400).json({
        success: false,
        message: "ID de categoría inválido."
      });
    }

    const category = await Category.getCategoryById(idCategoria);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada."
      });
    }

    return res.status(200).json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error("Error en getCategoryByIdController:", error.message);

    return res.status(500).json({
      success: false,
      message: "Fallo al obtener la categoría.",
      error: error.message
    });
  }
};


// --------------------------------------------------------
// U: ACTUALIZAR CATEGORÍA
// --------------------------------------------------------
/**
 * Actualiza parcialmente una categoría.
 * @route PUT /api/v1/categories/:id
 * @access Private/Admin
 */
export const updateCategoryController = async (req, res) => {
  try {
    const idCategoria = Number(req.params.id);
    const data = req.body;

    if (isNaN(idCategoria)) {
      return res.status(400).json({
        success: false,
        message: "ID de categoría inválido."
      });
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionaron datos para actualizar."
      });
    }

    const updated = await Category.updateCategory(idCategoria, data);

    if (!updated) {
      const exists = await Category.getCategoryById(idCategoria);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: "Categoría no encontrada."
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Categoría actualizada exitosamente."
    });

  } catch (error) {
    console.error("Error en updateCategoryController:", error.message);

    if (error.message.includes("ya existe")) {
      return res.status(409).json({ success: false, message: error.message });
    }

    return res.status(500).json({
      success: false,
      message: "Fallo al actualizar la categoría.",
      error: error.message
    });
  }
};


// --------------------------------------------------------
// D: ELIMINAR CATEGORÍA
// --------------------------------------------------------
/**
 * Elimina una categoría por su ID.
 * @route DELETE /api/v1/categories/:id
 * @access Private/Admin
 */
export const deleteCategoryController = async (req, res) => {
  try {
    const idCategoria = Number(req.params.id);

    if (isNaN(idCategoria)) {
      return res.status(400).json({
        success: false,
        message: "ID de categoría inválido."
      });
    }

    const deleted = await Category.deleteCategory(idCategoria);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Categoría eliminada exitosamente."
    });

  } catch (error) {
    console.error("Error en deleteCategoryController:", error.message);

    if (error.message.includes("No se puede eliminar")) {
      return res.status(409).json({ success: false, message: error.message });
    }

    return res.status(500).json({
      success: false,
      message: "Fallo al eliminar la categoría.",
      error: error.message
    });
  }
};
