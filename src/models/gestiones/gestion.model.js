import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export const gestionModel = sequelize.define(
  'gestiones',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    anio: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('ACTIVO', 'CERRADO'),
      defaultValue: 'ACTIVO',
    },
  },
  {
    tableName: 'gestiones',
    timestamps: true,
  },
);
