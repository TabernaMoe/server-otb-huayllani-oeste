import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

export const permisoModel = sequelize.define(
  'auth_permisos',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre_permiso: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codigo_permiso: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'auth_permisos',
    underscored: true,
    timestamps: false,
  },
);
