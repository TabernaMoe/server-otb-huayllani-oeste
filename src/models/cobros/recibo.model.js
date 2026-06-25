import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { pagoModel } from './pago.model.js';

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
    numero_recibo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_emision: {
      type: DataTypes.DATE,
      allowNull: DataTypes.NOW,
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
