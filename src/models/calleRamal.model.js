import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const calleRamalModel = sequelize.define(
  'calles_ramal',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre_calle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'calles_ramal',
    timestamps: false,
  },
);
