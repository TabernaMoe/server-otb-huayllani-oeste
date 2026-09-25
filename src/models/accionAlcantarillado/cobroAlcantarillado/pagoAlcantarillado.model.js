import { DataTypes, DATE } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { cobroAlcantarilladoModel } from './cobroAlcantarillado.model.js';

export const pagoAlcantarilladoModel = sequelize.define(
  'pagosAlcantarillado',
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
    tableName: 'pagos_alcantarillado',
    timestamps: true,
  },
);

export const pagoDetalleAlcantarilladoModel = sequelize.define(
  'pagoDetalleAlcantarillado',
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
        model: 'cobros_alcantarillado',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    pago_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pagos_alcantarillado',
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
    tableName: 'pago_detalle_alcantarillado',
    timestamps: false,
  },
);

cobroAlcantarilladoModel.belongsToMany(pagoAlcantarilladoModel, {
  as: 'pagosAlcantarillado',
  through: pagoDetalleAlcantarilladoModel,
  foreignKey: 'cobro_id',
  otherKey: 'pago_id',
});

pagoAlcantarilladoModel.belongsToMany(cobroAlcantarilladoModel, {
  as: 'cobroAlcantarillado',
  through: pagoDetalleAlcantarilladoModel,
  foreignKey: 'pago_id',
  otherKey: 'cobro_id',
});
