import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export const tipoAccionModel = sequelize.define(
  'TipoAccion',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_tipo_accion: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: 'tipos_accion',
    timestamps: true,
  },
);
