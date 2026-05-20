import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export const tipoAccionModel = sequelize.define(
  'tipos_acciones',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre_tipos_accion: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    costo_tipos_accion: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },  
  {
    tableName: 'tipos_acciones',
    timestamps: false,
    underscored: true,
  },
);
