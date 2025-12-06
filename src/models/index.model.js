// src/models/index.model.js
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
import orderModel from "./order.model.js";
import orderItemsModel from "./orden_items.model.js"; // 🔥 usa el nombre real del archivo

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
// 📌 REGISTRO DE MODELOS EN SINGULAR
// ==========================================================
db.Usuario      = userModel(sequelize, DataTypes);
db.Carrito      = cartModel(sequelize, DataTypes);
db.ItemsCarrito = itemsCartModel(sequelize, DataTypes);
db.Producto     = productModel(sequelize, DataTypes);
db.Categoria    = categoryModel(sequelize, DataTypes);
db.Estado       = stateModel(sequelize, DataTypes);
db.Rol          = rolModel(sequelize, DataTypes);
db.Orden        = orderModel(sequelize, DataTypes);
db.OrdenItem    = orderItemsModel(sequelize, DataTypes);

// ==========================================================
// 📌 CARGA DE ASOCIACIONES
// ==========================================================
Object.values(db).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(db);
  }
});

// Exportar instancia y modelos
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;


// // src/models/index.model.js
// import { Sequelize, DataTypes } from "sequelize";
// import dotenv from "dotenv";

// dotenv.config();

// // Importación de modelos
// import userModel from "./user.model.js";
// import cartModel from "./cart.model.js";
// import itemsCartModel from "./itemsCart.model.js";
// import productModel from "./product.model.js";
// import categoryModel from "./category.model.js";
// import stateModel from "./state.model.js";
// import rolModel from "./rol.model.js";
// import orderModel from "./order.model.js";
// import orderItemsModel from "./orderItems.model.js";

// // Inicializar Sequelize
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 3306,
//     dialect: "mysql",
//     logging: false,
//   }
// );

// const db = {};

// // ==========================================================
// // 📌 REGISTRO DE MODELOS EN SINGULAR
// // ==========================================================
// db.Usuario      = userModel(sequelize, DataTypes);
// db.Carrito      = cartModel(sequelize, DataTypes);
// db.ItemsCarrito = itemsCartModel(sequelize, DataTypes);
// db.Producto     = productModel(sequelize, DataTypes);
// db.Categoria    = categoryModel(sequelize, DataTypes);
// db.Estado       = stateModel(sequelize, DataTypes);
// db.Rol          = rolModel(sequelize, DataTypes);
// db.Orden        = orderModel(sequelize, DataTypes);
// db.OrdenItem    = orderItemsModel(sequelize, DataTypes);

// // ==========================================================
// // 📌 CARGA DE ASOCIACIONES
// // ==========================================================
// Object.values(db).forEach((model) => {
//   if (typeof model.associate === "function") {
//     model.associate(db);
//   }
// });

// // Exportar instancia y modelos
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// export default db;
