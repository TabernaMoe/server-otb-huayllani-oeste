import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    contrasenia_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'auth_usuarios',
    underscored: true,
    timestamps: false,
  },
);

export const usuarioRolModel = sequelize.define(
  'auth_usuario_rol',
  {
    usuario_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      references: {
        model: usuarioModel,
        key: 'id',
      },
    },
    rol_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      references: {
        model: rolModel,
        key: 'id',
      },
    },
  },
  {
    tableName: 'auth_usuario_rol',
    underscored: true,
    timestamps: false,
  },
);

usuarioModel.belongsToMany(rolModel, {
  through: usuarioRolModel,
  as: 'usuario_rol',
  foreignKey: 'usuario_id',
  otherKey: 'rol_id',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

rolModel.belongsToMany(usuarioModel, {
  through: usuarioRolModel,
  as: 'rol_usuario',
  foreignKey: 'rol_id',
  otherKey: 'usuario_id',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
