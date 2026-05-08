import { DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { socioModel } from './socio.model.js';
import { accionModel } from './accion.model.js';

export const cobroAccionModel = sequelize.define(
  'cobro_accion',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    socio_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: socioModel,
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    accion_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: accionModel,
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    concepto_cobro: {
      type: DataTypes.STRING,
      allowNull: false,
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
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'cobro_accion',
    underscored: true,
    timestamps: false,
  },
);

socioModel.hasMany(cobroAccionModel, {
  as: 'socio_cobro',
  foreignKey: 'socio_id',
});
cobroAccionModel.belongsTo(socioModel, {
  as: 'cobro_socio',
  foreignKey: 'socio_id',
});

accionModel.hasMany(cobroAccionModel, {
  as: 'accion_cobro',
  foreignKey: 'accion_id',
});
cobroAccionModel.belongsTo(accionModel, {
  as: 'cobro_accion',
  foreignKey: 'accion_id',
});
