import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { pagoModel } from './pago.model.js';
import { socioModel } from '../socio.model.js';
import { accionModel } from '../accion/accion.model.js';

export const reciboModel = sequelize.define(
  'recibos',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    socio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'socios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    accion_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'acciones',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    pago_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pagos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    numero_recibo: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    fecha_emision: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'recibos',
    timestamps: true,
  },
);

pagoModel.hasOne(reciboModel, {
  as: 'recibo',
  foreignKey: 'pago_id',
});
reciboModel.belongsTo(pagoModel, {
  as: 'pago',
  foreignKey: 'pago_id',
});
//
socioModel.hasMany(reciboModel, {
  as: 'recibos',
  foreignKey: 'socio_id',
});
reciboModel.belongsTo(socioModel, {
  as: 'socioRecibo',
  foreignKey: 'socio_id',
});
accionModel.hasMany(reciboModel, {
  as: 'accionRecibo',
  foreignKey: 'accion_id',
});
reciboModel.belongsTo(accionModel, {
  as: 'reciboAccion',
  foreignKey: 'accion_id',
});
