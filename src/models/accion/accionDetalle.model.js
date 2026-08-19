import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export const accionDetalleModel = sequelize.define(
  'accion_detalle',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'acciones',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    detalle_pago_accion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'detalle_pago_accion',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
  },
  {
    tableName: 'accion_detalle',
    underscored: true,
    timestamps: false,
  },
);
