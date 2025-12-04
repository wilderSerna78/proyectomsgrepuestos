export default (sequelize, DataTypes) => {
  const State = sequelize.define(
    "estado",
    {
      idEstado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "idEstado",
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: "nombre",
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "descripcion",
      },
    },
    {
      tableName: "estado",
      timestamps: false,
      freezeTableName: true,
    }
  );

  State.associate = (models) => {
    State.hasMany(models.Productos, {
      foreignKey: "idEstado",
      as: "productos",
    });

    State.hasMany(models.Usuario, {
      foreignKey: "idEstado",
      as: "usuarios",
    });
  };

  return State;
};