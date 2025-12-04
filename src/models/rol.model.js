export default (sequelize, DataTypes) => {
  const Rol = sequelize.define(
    "rol",
    {
      idRol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "idRol",
      },
      nombreRol: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: "nombreRol",
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "descripcion",
      },
    },
    {
      tableName: "rol",
      timestamps: false,
      freezeTableName: true,
    }
  );

  Rol.associate = (models) => {
    Rol.hasMany(models.Usuario, {
      foreignKey: "idRol",
      as: "usuarios",
    });
  };

  return Rol;
};