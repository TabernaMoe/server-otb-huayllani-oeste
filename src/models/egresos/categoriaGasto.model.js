import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export const CategoriaGastosModel = sequelize.define(
  'CategoriaGastos',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_gasto: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: 'categorias_gastos',
    timestamps: true,
  },
);
