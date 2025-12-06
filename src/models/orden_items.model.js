// src/models/orden_items.model.js
export default (sequelize, DataTypes) => {
  const OrdenItem = sequelize.define(
    "OrdenItem", // nombre del modelo en singular
    {
      idItem: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idOrden: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "orden_items", // nombre real de la tabla
      timestamps: false,
    }
  );

  // Asociaciones
  OrdenItem.associate = (models) => {
    // Relación con Orden
    OrdenItem.belongsTo(models.Orden, {
      foreignKey: "idOrden",
      as: "orden",
    });

    // Relación con Producto
    OrdenItem.belongsTo(models.Producto, {
      foreignKey: "idProducto",
      as: "producto",
    });
  };

  return OrdenItem;
};


// // src/models/orden_items.model.js
// export default (sequelize, DataTypes) => {
//   const OrdenItems = sequelize.define(
//     "OrdenItems", // nombre del modelo en Sequelize
//     {
//       idItem: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       idOrden: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       idProducto: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       cantidad: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         defaultValue: 1,
//       },
//       precioUnitario: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false,
//         defaultValue: 0.00,
//       },
//       subtotal: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false,
//         defaultValue: 0.00,
//       },
//     },
//     {
//       tableName: "orden_items", // nombre exacto de la tabla en tu BD
//       timestamps: false,
//     }
//   );

//   // Asociaciones
//   OrdenItems.associate = (models) => {
//     // Relación con Orden
//     OrdenItems.belongsTo(models.Ordenes, {
//       foreignKey: "idOrden",
//       as: "orden",
//     });

//     // Relación con Producto
//     OrdenItems.belongsTo(models.Producto, {
//       foreignKey: "idProducto",
//       as: "producto",
//     });
//   };

//   return OrdenItems;
// };
