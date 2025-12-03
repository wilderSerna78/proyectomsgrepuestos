// --- product.model.js ---
import { connectMySQL } from "../config/mysql.config.js";

export const Product = {};

/* ================================
   📌 CREAR PRODUCTO
   ================================ */
Product.createProduct = async (productData) => {
  const connection = await connectMySQL();

  const {
    nombreProducto,
    descripcion,
    modelosMoto,
    marcaRepuesto,
    precioCompra,
    precioVenta,
    imagen,
    stock,
    detalles,
    medidaEstandar,
    idCategoria,
    idEstado,
  } = productData;

  const query = `
    INSERT INTO Productos (
      nombreProducto, descripcion, modelosMoto, marcaRepuesto,
      precioCompra, precioVenta, imagen, stock, detalles,
      medidaEstandar, idCategoria, idEstado
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nombreProducto,
    descripcion,
    modelosMoto,
    marcaRepuesto,
    precioCompra,
    precioVenta,
    imagen,
    stock,
    detalles,
    medidaEstandar,
    idCategoria,
    idEstado,
  ];

  try {
    const [result] = await connection.execute(query, values);
    return { idProducto: result.insertId };
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw new Error("Error en la base de datos.");
  } finally {
    await connection.end();
  }
};

/* ================================
   📌 CONSULTAR TODOS LOS PRODUCTOS (con filtros opcionales)
   ================================ */
Product.getAllProducts = async (filters = {}) => {
  const connection = await connectMySQL();
  let whereClauses = [];
  let queryParams = [];

  if (filters.nombre) {
    whereClauses.push("p.nombreProducto LIKE ?");
    queryParams.push(`%${filters.nombre}%`);
  }

  if (filters.marca) {
    whereClauses.push("p.marcaRepuesto LIKE ?");
    queryParams.push(`%${filters.marca}%`);
  }

  if (filters.categoriaId) {
    whereClauses.push("p.idCategoria = ?");
    queryParams.push(filters.categoriaId);
  }

  const whereString =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const query = `
    SELECT 
      p.idProducto, p.nombreProducto, p.descripcion, p.modelosMoto,
      p.marcaRepuesto, p.precioVenta, p.stock, p.imagen,
      p.medidaEstandar, c.nombreCategoria, e.nombre AS nombreEstado
    FROM Productos p
    JOIN Categorias c ON p.idCategoria = c.idCategoria
    JOIN Estado e ON p.idEstado = e.idEstado
    ${whereString}
    ORDER BY p.nombreProducto;
  `;

  try {
    const [rows] = await connection.execute(query, queryParams);
    return rows;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw new Error("Error en la base de datos.");
  } finally {
    await connection.end();
  }
};

/* ================================
   📌 CONSULTAR PRODUCTO POR ID
   ================================ */
Product.getProductById = async (idProducto) => {
  const connection = await connectMySQL();

  const query = `
    SELECT p.*, c.nombreCategoria, e.nombre AS nombreEstado
    FROM Productos p
    JOIN Categorias c ON p.idCategoria = c.idCategoria
    JOIN Estado e ON p.idEstado = e.idEstado
    WHERE p.idProducto = ?
  `;

  try {
    const [rows] = await connection.execute(query, [idProducto]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    throw new Error("Error en la base de datos.");
  } finally {
    await connection.end();
  }
};

/* ================================
   📌 ACTUALIZAR PRODUCTO
   ================================ */
Product.updateProduct = async (idProducto, productData) => {
  const connection = await connectMySQL();

  const setClauses = [];
  const updateValues = [];

  for (const key in productData) {
    setClauses.push(`${key} = ?`);
    updateValues.push(productData[key]);
  }

  if (setClauses.length === 0) return 0;

  updateValues.push(idProducto);

  const query = `
    UPDATE Productos
    SET ${setClauses.join(", ")}
    WHERE idProducto = ?
  `;

  try {
    const [result] = await connection.execute(query, updateValues);
    return result.affectedRows;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw new Error("Error en la base de datos.");
  } finally {
    await connection.end();
  }
};

/* ================================
   📌 ELIMINAR PRODUCTO
   ================================ */
Product.deleteProduct = async (idProducto) => {
  const connection = await connectMySQL();
  const query = "DELETE FROM Productos WHERE idProducto = ?";

  try {
    const [result] = await connection.execute(query, [idProducto]);
    return result.affectedRows;
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw new Error(
      "No se pudo eliminar. Puede estar relacionado con pedidos o carritos."
    );
  } finally {
    await connection.end();
  }
};
