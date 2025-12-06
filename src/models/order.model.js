// src/models/order.model.js
export default (sequelize, DataTypes) => {
  const Orden = sequelize.define(
    "Orden", // nombre del modelo en singular
    {
      idOrden: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      impuesto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      idEstado: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "ordenes", // nombre real de la tabla en BD
      timestamps: false,
    }
  );

  // Asociaciones
  Orden.associate = (models) => {
    // Relación con Usuario
    Orden.belongsTo(models.Usuario, {
      foreignKey: "idUsuario",
      as: "usuario",
    });

    // Relación con Estado
    Orden.belongsTo(models.Estado, {
      foreignKey: "idEstado",
      as: "estado",
    });

    // Relación con Items de la Orden
    Orden.hasMany(models.OrdenItem, {
      foreignKey: "idOrden",
      as: "items",
    });
  };

  return Orden;
};




// // src/models/order.model.js
// export default (sequelize, DataTypes) => {
//   const Ordenes = sequelize.define(
//     "Ordenes", // nombre del modelo en Sequelize
//     {
//       idOrden: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       idUsuario: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       subtotal: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false,
//         defaultValue: 0.00,
//       },
//       impuesto: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false,
//         defaultValue: 0.00,
//       },
//       total: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false,
//         defaultValue: 0.00,
//       },
//       fecha: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//       },
//       idEstado: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         defaultValue: 1, // estado inicial: pendiente
//       },
//     },
//     {
//       tableName: "ordenes", // nombre exacto de la tabla en tu BD
//       timestamps: false,    // desactiva createdAt/updatedAt automáticos
//     }
//   );

//   // Asociaciones
//   Ordenes.associate = (models) => {
//     // Relación con Usuario
//     Ordenes.belongsTo(models.Usuario, {
//       foreignKey: "idUsuario",
//       as: "usuario",
//     });

//     // Relación con Estado
//     Ordenes.belongsTo(models.Estado, {
//       foreignKey: "idEstado",
//       as: "estado",
//     });

//     // Relación con Items de la Orden
//     Ordenes.hasMany(models.OrdenItems, {
//       foreignKey: "idOrden",
//       as: "items",
//     });
//   };

//   return Ordenes;
// };
