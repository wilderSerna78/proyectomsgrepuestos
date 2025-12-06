// src/models/category.model.js
export default (sequelize, DataTypes) => {
  const Categoria = sequelize.define(
    "Categoria", // ← nombre del modelo en singular
    {
      idCategoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombreCategoria: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "categorias", // ← nombre exacto de la tabla en la BD
      timestamps: false,
    }
  );

  // Asociaciones
  Categoria.associate = (models) => {
    Categoria.hasMany(models.Producto, {
      foreignKey: "idCategoria",
      as: "productos",
    });
  };

  return Categoria;
};



// export default (sequelize, DataTypes) => {
//   const Category = sequelize.define(
//     "categorias",
//     {
//       idCategoria: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         field: "idCategoria",
//       },
//       nombreCategoria: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//         unique: true,
//         field: "nombreCategoria",
//       },
//       descripcion: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//         field: "descripcion",
//       },
//     },
//     {
//       tableName: "Categorias",
//       timestamps: false,
//       freezeTableName: true,
//     }
//   );

//   Category.associate = (models) => {
//     Category.hasMany(models.Productos, {
//       foreignKey: "idCategoria",
//       as: "productos",
//     });
//   };

//   return Category;
// };