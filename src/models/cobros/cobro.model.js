import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { socioModel } from '../socio.model.js';
import { periodoModel } from '../gestiones/periodo.model.js';

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
      allowNull: false,
      references: {
        model: 'socios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    periodo_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'periodos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    tipo_cobro: {
      type: DataTypes.ENUM('ACCION', 'CAMBIO_NOMBRE_ACCION', 'OTRO'),
    },
    concepto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monto_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    monto_pagado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: 0,
    },
    saldo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
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
    timestamps: true,
  },
);

socioModel.hasMany(cobroModel, {
  as: 'cobrosSocio',
  foreignKey: 'socio_id',
});

cobroModel.belongsTo(socioModel, {
  as: 'socioCobro',
  foreignKey: 'socio_id',
});

//

periodoModel.hasMany(cobroModel, {
  as: 'cobros',
  foreignKey: 'periodo_id',
});
cobroModel.belongsTo(periodoModel, {
  as: 'periodo',
  foreignKey: 'periodo_id',
});
