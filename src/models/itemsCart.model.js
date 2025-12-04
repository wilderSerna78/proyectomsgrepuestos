// src/models/itemsCart.model.js

export default (sequelize, DataTypes) => {
  const ItemsCarrito = sequelize.define(
    "ItemsCarrito",
    {
      idItemCarrito: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idCarrito: {
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
        defaultValue: 1,
      },
      precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
    },
    {
      tableName: "itemscarrito",
      timestamps: false,
      freezeTableName: true,
    }
  );

  ItemsCarrito.associate = (models) => {
    ItemsCarrito.belongsTo(models.Carrito, {
      foreignKey: "idCarrito",
      as: "carrito",
    });

    ItemsCarrito.belongsTo(models.Productos, {
      foreignKey: "idProducto",
      as: "producto",
    });
  };

  return ItemsCarrito;
};


// // src/models/itemsCart.model.js

// export default (sequelize, DataTypes) => {
//   const ItemsCarrito = sequelize.define(
//     "itemsCarrito",
//     {
//       idItem: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         field: "idItem",
//       },

//       idCarrito: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         field: "idCarrito",
//       },

//       idProducto: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         field: "idProducto",
//       },

//       cantidad: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         defaultValue: 1,
//       },
//     },
//     {
//       tableName: "itemsCarrito",
//       timestamps: false,
//       freezeTableName: true,
//     }
//   );

//   // 🔗 Asociaciones
//   ItemsCarrito.associate = (models) => {
//     // Un item pertenece a un carrito
//     ItemsCarrito.belongsTo(models.Carrito, {  // ✅ Cambié 'carrito' a 'Carrito'
//       foreignKey: "idCarrito",
//       as: "carrito",
//     });

//     // Un item pertenece a un producto
//     ItemsCarrito.belongsTo(models.Productos, {  // ✅ Cambié 'productos' a 'Productos'
//       foreignKey: "idProducto",
//       as: "producto",
//     });
//   };

//   return ItemsCarrito;
// };