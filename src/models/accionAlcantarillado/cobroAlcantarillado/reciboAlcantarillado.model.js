import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { pagoAlcantarilladoModel } from './pagoAlcantarillado.model.js';

export const reciboAlcantarilladoModel = sequelize.define(
  'recibosAlcantarillado',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      allowNull: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'recibos_alcantarillado',
    timestamps: true,
  },
);

pagoAlcantarilladoModel.hasOne(reciboAlcantarilladoModel, {
  as: 'recibo',
  foreignKey: 'pago_id',
});
reciboAlcantarilladoModel.belongsTo(pagoAlcantarilladoModel, {
  as: 'pago',
  foreignKey: 'pago_id',
});
