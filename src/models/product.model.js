// src/models/product.model.js
export default (sequelize, DataTypes) => {
  const Producto = sequelize.define(
    "Producto", // ← nombre del modelo en singular
    {
      idProducto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombreProducto: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      modelosMoto: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      marcaRepuesto: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      medidaEstandar: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      detalles: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      precioCompra: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      precioVenta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imagen: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      idCategoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idEstado: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "productos", // ← nombre real de la tabla
      timestamps: false,
    }
  );

  // Asociaciones
  Producto.associate = (models) => {
    // Relación con Categoria
    Producto.belongsTo(models.Categoria, {
      foreignKey: "idCategoria",
      as: "categoria",
    });

    // Relación con Estado
    Producto.belongsTo(models.Estado, {
      foreignKey: "idEstado",
      as: "estado",
    });

    // Relación con ItemsCarrito
    Producto.hasMany(models.ItemsCarrito, {
      foreignKey: "idProducto",
      as: "itemsCarrito",
    });

    // Relación con OrdenItem
    Producto.hasMany(models.OrdenItem, {
      foreignKey: "idProducto",
      as: "ordenItems",
    });
  };

  return Producto;
};

// export default (sequelize, DataTypes) => {
//   const Product = sequelize.define(
//     "productos",
//     {
//       idProducto: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         field: "idProducto",
//       },
//       nombreProducto: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//         field: "nombreProducto",
//       },
//       descripcion: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//         field: "descripcion",
//       },
//       modelosMoto: {
//         type: DataTypes.STRING(200),
//         allowNull: true,
//         field: "modelosMoto",
//       },
//       marcaRepuesto: {
//         type: DataTypes.STRING(100),
//         allowNull: true,
//         field: "marcaRepuesto",
//       },
//       precioCompra: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false,
//         field: "precioCompra",
//       },
//       precioVenta: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false,
//         field: "precioVenta",
//       },
//       imagen: {
//         type: DataTypes.STRING(255),
//         allowNull: true,
//         field: "imagen",
//       },
//       stock: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         defaultValue: 0,
//         field: "stock",
//       },
//       detalles: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//         field: "detalles",
//       },
//       medidaEstandar: {
//         type: DataTypes.STRING(50),
//         allowNull: true,
//         field: "medidaEstandar",
//       },
//       idCategoria: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         field: "idCategoria",
//       },
//       idEstado: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         field: "idEstado",
//       },
//     },
//     {
//       tableName: "Productos",
//       timestamps: false,
//       freezeTableName: true,
//     }
//   );

//   Product.associate = (models) => {
//     Product.belongsTo(models.Categorias, {
//       foreignKey: "idCategoria",
//       as: "categoria",
//     });

//     Product.belongsTo(models.Estado, {
//       foreignKey: "idEstado",
//       as: "estado",
//     });

//     Product.hasMany(models.ItemsCarrito, {
//       foreignKey: "idProducto",
//       as: "itemsCarrito",
//     });

//     // Product.hasMany(models.ItemsCart, {
//     //   foreignKey: "idProducto",
//     //   as: "itemsCarrito",
//     // });
//   };

//   return Product;
// };
