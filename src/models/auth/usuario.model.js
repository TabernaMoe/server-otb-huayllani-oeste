import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { rolModel } from './rol.model.js';

export const usuarioModel = sequelize.define(
  'auth_usuarios',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre_usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    contrasenia_usuario: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol_id: {
      type: DataTypes.BIGINT,
      references: {
        model: rolModel,
        key: 'id',
      },
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'auth_usuarios',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['nombre_usuario'],
      },
      {
        fields: ['rol_id'],
      },
    ],
  },
);

rolModel.hasMany(usuarioModel, {
  as: 'usuarios',
  foreignKey: 'rol_id',
});
usuarioModel.belongsTo(rolModel, {
  as: 'rol',
  foreignKey: 'rol_id',
});
