// src/models/state.model.js
export default (sequelize, DataTypes) => {
  const Estado = sequelize.define(
    "Estado", // nombre del modelo en singular
    {
      idEstado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "estado", // nombre real de la tabla en tu BD
      timestamps: false,
    }
  );

  Estado.associate = (models) => {
    // Relación con Usuario
    Estado.hasMany(models.Usuario, {
      foreignKey: "idEstado",
      as: "usuarios",
    });

    // Relación con Producto
    Estado.hasMany(models.Producto, {
      foreignKey: "idEstado",
      as: "productos",
    });

    // Relación con Orden
    Estado.hasMany(models.Orden, {
      foreignKey: "idEstado",
      as: "ordenes",
    });
  };

  return Estado;
};

// export default (sequelize, DataTypes) => {
//   const State = sequelize.define(
//     "estado",
//     {
//       idEstado: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         field: "idEstado",
//       },
//       nombre: {
//         type: DataTypes.STRING(50),
//         allowNull: false,
//         unique: true,
//         field: "nombre",
//       },
//       descripcion: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//         field: "descripcion",
//       },
//     },
//     {
//       tableName: "estado",
//       timestamps: false,
//       freezeTableName: true,
//     }
//   );

//   State.associate = (models) => {
//     State.hasMany(models.Productos, {
//       foreignKey: "idEstado",
//       as: "productos",
//     });

//     State.hasMany(models.Usuario, {
//       foreignKey: "idEstado",
//       as: "usuarios",
//     });
//   };

//   return State;
// };
