export default (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "productos",
    {
      idProducto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "idProducto",
      },
      nombreProducto: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "nombreProducto",
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "descripcion",
      },
      modelosMoto: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: "modelosMoto",
      },
      marcaRepuesto: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "marcaRepuesto",
      },
      precioCompra: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "precioCompra",
      },
      precioVenta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "precioVenta",
      },
      imagen: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "imagen",
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "stock",
      },
      detalles: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "detalles",
      },
      medidaEstandar: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "medidaEstandar",
      },
      idCategoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "idCategoria",
      },
      idEstado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "idEstado",
      },
    },
    {
      tableName: "Productos",
      timestamps: false,
      freezeTableName: true,
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Categorias, {
      foreignKey: "idCategoria",
      as: "categoria",
    });

    Product.belongsTo(models.Estado, {
      foreignKey: "idEstado",
      as: "estado",
    });

    Product.hasMany(models.ItemsCarrito, {
      foreignKey: "idProducto",
      as: "itemsCarrito",
    });

    // Product.hasMany(models.ItemsCart, {
    //   foreignKey: "idProducto",
    //   as: "itemsCarrito",
    // });
  };

  return Product;
};
