import { sequelize } from '../../config/database.js';
import { DataTypes } from 'sequelize';

export const multaModel = sequelize.define(
  'Multa',
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    monto_multa: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    tableName: 'multas',
    timestamps: true,
  },
);
