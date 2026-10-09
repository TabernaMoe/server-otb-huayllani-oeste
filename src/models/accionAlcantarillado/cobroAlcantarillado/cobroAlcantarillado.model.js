import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { socioModel } from '../../socio.model.js';
import { periodoModel } from '../../gestiones/periodo.model.js';
import { accionAlcantarilladoModel } from '../acccionAlcantarillado.model.js';

export const cobroAlcantarilladoModel = sequelize.define(
  'cobrosAlcantarillado',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    socio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'socios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    accion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'acciones_alcantarillado',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    periodo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'periodos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    tipo_cobro: {
      type: DataTypes.ENUM(
        'ACCION',
        'MULTA',
        'CAMBIO_NOMBRE_ACCION',
        'MANTENIMIENTO',
        'ASAMBLEA',
        'OTRAS_MULTAS',
      ),
      allowNull: false,
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
      defaultValue: 0,
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
    tableName: 'cobros_alcantarillado',
    timestamps: true,
  },
);

socioModel.hasMany(cobroAlcantarilladoModel, {
  as: 'cobrosSocioAlcantarillado',
  foreignKey: 'socio_id',
});

cobroAlcantarilladoModel.belongsTo(socioModel, {
  as: 'socioCobroAlcantarillado',
  foreignKey: 'socio_id',
});
//
periodoModel.hasMany(cobroAlcantarilladoModel, {
  as: 'cobrosPeriodoAlcantarillado',
  foreignKey: 'periodo_id',
});
cobroAlcantarilladoModel.belongsTo(periodoModel, {
  as: 'periodoAlcantarillado',
  foreignKey: 'periodo_id',
});
//
accionAlcantarilladoModel.hasMany(cobroAlcantarilladoModel, {
  as: 'cobrosAccionAlcantarrillado',
  foreignKey: 'accion_id',
});
cobroAlcantarilladoModel.belongsTo(accionAlcantarilladoModel, {
  as: 'accionCobroAlcantarillado',
  foreignKey: 'accion_id',
});
