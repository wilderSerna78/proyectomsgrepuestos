// src/models/cart.model.js

export default (sequelize, DataTypes) => {
  const Carrito = sequelize.define(
    "Carrito", // ← nombre del modelo en singular
    {
      idCarrito: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fechaActualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "carrito", // ← nombre real de la tabla
      timestamps: false,
    }
  );

  // Asociaciones
  Carrito.associate = (models) => {
    // Relación con ItemsCarrito
    Carrito.hasMany(models.ItemsCarrito, {
      foreignKey: "idCarrito",
      as: "items", // ← este alias se usa en include
    });

    // Relación con Usuario
    Carrito.belongsTo(models.Usuario, {
      foreignKey: "idUsuario",
      as: "usuario", // ← este alias se usa en include
    });
  };

  return Carrito;
};


// // src/models/cart.model.js

// export default (sequelize, DataTypes) => {
//   const Carrito = sequelize.define(
//     "Carrito",
//     {
//       idCarrito: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       idUsuario: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       fechaActualizacion: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//       },
//     },
//     {
//       tableName: "carrito",
//       timestamps: false,
//       freezeTableName: true,
//     }
//   );

//   Carrito.associate = (models) => {
//     Carrito.hasMany(models.ItemsCarrito, {
//       foreignKey: "idCarrito",
//       as: "items",
//     });

//     Carrito.belongsTo(models.Usuario, {
//       foreignKey: "idUsuario",
//       as: "usuario",
//     });
//   };

//   return Carrito;
// };
