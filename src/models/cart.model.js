// src/models/cart.model.js

export default (sequelize, DataTypes) => {
  const Carrito = sequelize.define(
    "Carrito",
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
      tableName: "carrito",
      timestamps: false,
      freezeTableName: true,
    }
  );

  Carrito.associate = (models) => {
    Carrito.hasMany(models.ItemsCarrito, {
      foreignKey: "idCarrito",
      as: "items",
    });

    Carrito.belongsTo(models.Usuario, {
      foreignKey: "idUsuario",
      as: "usuario",
    });
  };

  return Carrito;
};
