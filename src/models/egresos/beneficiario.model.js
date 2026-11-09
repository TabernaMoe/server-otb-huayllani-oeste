import { sequelize } from '../../config/database.js';
import { DataTypes } from 'sequelize';

export const BeneficiarioEgresosModel = sequelize.define(
  'BeneficiarioEgreso',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_beneficiario: { type: DataTypes.STRING },
  },
  {
    tableName: 'beneficiario_egresos',
    timestamps: true,
  },
);
