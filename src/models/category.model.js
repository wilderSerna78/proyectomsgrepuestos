export default (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "categorias",
    {
      idCategoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "idCategoria",
      },
      nombreCategoria: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: "nombreCategoria",
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "descripcion",
      },
    },
    {
      tableName: "Categorias",
      timestamps: false,
      freezeTableName: true,
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Productos, {
      foreignKey: "idCategoria",
      as: "productos",
    });
  };

  return Category;
};