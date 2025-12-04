// src/models/index.js
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Importación de modelos
import userModel from "./user.model.js";
import cartModel from "./cart.model.js";
import itemsCartModel from "./itemsCart.model.js";
import productModel from "./product.model.js";
import categoryModel from "./category.model.js";
import stateModel from "./state.model.js";
import rolModel from "./rol.model.js";

// Inicializar Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  }
);

const db = {};

// ==========================================================
// 📌 MODELOS NORMALIZADOS CON NOMBRES CONSISTENTES
// ==========================================================

// Debe coincidir EXACTAMENTE con lo usado en controllers:
// const { ItemsCarrito, Carrito, Productos } = db;

db.Usuario       = userModel(sequelize, DataTypes);
db.Carrito       = cartModel(sequelize, DataTypes);
db.ItemsCarrito  = itemsCartModel(sequelize, DataTypes);   // ← CORREGIDO
db.Productos     = productModel(sequelize, DataTypes);
db.Categorias    = categoryModel(sequelize, DataTypes);
db.Estado        = stateModel(sequelize, DataTypes);
db.Rol           = rolModel(sequelize, DataTypes);

// ==========================================================
// 📌 CARGA DE ASOCIACIONES
// ==========================================================
Object.values(db).forEach((model) => {
  if (model?.associate) {
    model.associate(db);
  }
});

// Exportar
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;



// import { Sequelize, DataTypes } from "sequelize";
// import dotenv from "dotenv";

// dotenv.config(); // Cargar variables de entorno

// // Importaciones de modelos
// import userModel from "./user.model.js";
// import cartModel from "./cart.model.js";
// import itemsCartModel from "./itemsCart.model.js";
// import productModel from "./product.model.js";
// import categoryModel from "./category.model.js";
// import stateModel from "./state.model.js";
// import rolModel from "./rol.model.js";

// // Inicialización de Sequelize usando las mismas variables de entorno
// const sequelize = new Sequelize(
//   process.env.DB_NAME,      // Nombre de la base de datos
//   process.env.DB_USER,      // Usuario
//   process.env.DB_PASSWORD,  // Contraseña
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 3306,
//     dialect: "mysql",
//     logging: false, // Cambia a console.log si quieres ver las queries SQL
//   }
// );

// const db = {};

// // Inicializar modelos
// db.Usuario = userModel(sequelize, DataTypes);
// db.Carrito = cartModel(sequelize, DataTypes);
// db.ItemsCart = itemsCartModel(sequelize, DataTypes);
// db.Productos = productModel(sequelize, DataTypes);
// db.Categorias = categoryModel(sequelize, DataTypes);
// db.Estado = stateModel(sequelize, DataTypes);
// db.Rol = rolModel(sequelize, DataTypes);

// // Asociaciones
// Object.keys(db).forEach((modelName) => {
//   if (db[modelName]?.associate) {
//     db[modelName].associate(db);
//   }
// });

// // Exportar instancia de Sequelize y modelos
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// export default db;