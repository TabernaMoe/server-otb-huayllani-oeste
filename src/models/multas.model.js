import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const multaModel = sequelize.define(
  'Multa',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_multa: { type: DataTypes.STRING },
    precio: { type: DataTypes.DECIMAL(10, 2) },
    estado: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: 'multas',
    timestamps: true,
  },
);
