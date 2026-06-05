import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export const reciboModel = sequelize.define(
  'recibos',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    pago_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'pagos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    monto_pagado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    metodo_pago: {
      type: DataTypes.ENUM('QR', 'EFECTIVO'),
      allowNull: false,
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: DataTypes.NOW,
    },
  },
  {
    tableName: 'recibos',
    timestamps: true,
  },
);
