import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const inventarioModel = sequelize.define(
  'inventario',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_producto: { type: DataTypes.STRING },
    salida: { type: DataTypes.INTEGER, defaultValue: 0 },
    saldo_actual: { type: DataTypes.INTEGER },
  },
  {
    tableName: 'inventario',
    timestamps: true,
  },
);
