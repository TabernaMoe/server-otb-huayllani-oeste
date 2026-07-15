import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { pagoAguaModel } from './pagoAgua.model.js';

export const reciboAguaModel = sequelize.define(
  'recibo_agua',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    pago_agua_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pago_agua',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      unique: true,
    },
    numero_recibo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // unique: true,
      defaultValue: sequelize.literal(
        "nextval('recibo_agua_numero_recibo_seq')",
      ),
    },
    fecha_emision: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'recibo_agua',
    timestamps: true,
  },
);

pagoAguaModel.hasOne(reciboAguaModel, {
  as: 'pagoAguaRecibo',
  foreignKey: 'pago_agua_id',
});
reciboAguaModel.belongsTo(pagoAguaModel, {
  as: 'reciboAguaRecibo',
  foreignKey: 'pago_agua_id',
});
