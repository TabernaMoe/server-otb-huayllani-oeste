import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { cobroAguaModel } from './cobroAgua.model.js';

export const pagoAguaModel = sequelize.define(
  'pago_agua',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cobro_agua_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cobro_agua',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    metodo_pago: { type: DataTypes.ENUM('EFECTIVO', 'QR'), allowNull: false },
    observacion: { type: DataTypes.STRING },
  },
  {
    tableName: 'pago_agua',
    timestamps: true,
  },
);

cobroAguaModel.hasOne(pagoAguaModel, {
  as: 'cobroAgua',
  foreignKey: 'cobro_agua_id',
});
pagoAguaModel.belongsTo(cobroAguaModel, {
  as: 'pagoAgua',
  foreignKey: 'cobro_agua_id',
});
