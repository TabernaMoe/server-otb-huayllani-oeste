import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const calleRamalModel = sequelize.define(
  'calles_ramal',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
