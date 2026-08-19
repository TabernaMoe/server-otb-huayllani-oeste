import { sequelize } from '../../config/database.js';
import { DataTypes } from 'sequelize';

export const tarifaModel = sequelize.define(
  'Tarifa',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_tarifa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'tarifas',
    timestamps: true,
  },
);
