import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const cobroModel = sequelize.define(
  'cobros',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    socio_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'socios',
        key: 'id',
      },
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },

    tipo_cobro: {
      type: DataTypes.ENUM('ACCION', 'CAMBIO_NOMBRE_ACCION', 'OTRO'),
    },

    referencia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    concepto_cobro: {
      type: DataTypes.STRING,
    },

    descripcion: {
      type: DataTypes.STRING,
    },
    monto_total_cobro: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    monto_pagado_cobro: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    saldo_cobro: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado_cobro: {
      type: DataTypes.ENUM('PENDIENTE', 'PAGADO', 'PARCIAL', 'ANULADO'),
      defaultValue: 'PENDIENTE',
    },
    fecha_emision: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'cobros',
    underscored: true,
    timestamps: false,
  },
);
