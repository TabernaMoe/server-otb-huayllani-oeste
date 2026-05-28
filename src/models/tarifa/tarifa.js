import { sequelize } from '../../config/database.js';
import { DataTypes } from 'sequelize';

export const tarifaModel = sequelize.define(
  'tarifa',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_tarifa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'tarifa',
    timestamps: true,
  },
);
