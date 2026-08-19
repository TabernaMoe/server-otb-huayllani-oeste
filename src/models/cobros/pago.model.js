import { DataTypes, DATE } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { cobroModel } from './cobro.model.js';

export const pagoModel = sequelize.define(
  'pagos',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    tableName: 'pagos',
    timestamps: true,
  },
);

export const pagoDetalleModel = sequelize.define(
  'pago_detalle',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cobro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cobros',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    pago_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pagos',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: 'pago_detalle',
    timestamps: false,
  },
);

cobroModel.belongsToMany(pagoModel, {
  through: pagoDetalleModel,
  foreignKey: 'cobro_id',
  otherKey: 'pago_id',
});

pagoModel.belongsToMany(cobroModel, {
  through: pagoDetalleModel,
  foreignKey: 'pago_id',
  otherKey: 'cobro_id',
});
