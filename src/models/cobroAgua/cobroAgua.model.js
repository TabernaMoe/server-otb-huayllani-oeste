import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { accionModel } from '../accion/accion.model.js';
import { periodoModel } from '../gestiones/periodo.model.js';
import { socioModel } from '../socio.model.js';
import { lecturaAguaModel } from '../lecturasAgua/lecturasAgua.model.js';

export const cobroAguaModel = sequelize.define(
  'cobro_agua',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    lectura_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'lecturas_agua',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
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
      type: DataTypes.ENUM('PENDIENTE', 'PAGADO', 'ANULADO'),
      defaultValue: 'PENDIENTE',
    },
    fecha_emision: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'cobro_agua',
    timestamps: true,
  },
);

socioModel.hasMany(cobroAguaModel, {
  as: 'cobrosAgua',
  foreignKey: 'socio_id',
});
cobroAguaModel.belongsTo(socioModel, {
  as: 'socioAgua',
  foreignKey: 'socio_id',
});
periodoModel.hasMany(cobroAguaModel, {
  as: 'cobrosAguaPeriodo',
  foreignKey: 'periodo_id',
});
cobroAguaModel.belongsTo(periodoModel, {
  as: 'cobroPeriodoAgua',
  foreignKey: 'periodo_id',
});
lecturaAguaModel.hasOne(cobroAguaModel, {
  as: 'cobroAgua',
  foreignKey: 'lectura_id',
});
cobroAguaModel.belongsTo(lecturaAguaModel, {
  as: 'aguaCobro',
  foreignKey: 'id',
});
