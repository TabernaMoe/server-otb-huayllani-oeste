import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { cobroAccionModel } from './cobroAccion.model.js';

export const pagoAccionModel = sequelize.define(
  'pago_accion',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    cobro_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: cobroAccionModel,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    monto_pago: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    metodo_pago: {
      type: DataTypes.ENUM('efectivo', 'qr'),
      defaultValue: 'efectivo',
      allowNull: false,
    },
    fecha_pago: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    observaciones_pago: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'pago_accion',
    underscored: true,
    timestamps: false,
  },
);

cobroAccionModel.hasMany(pagoAccionModel, {
  as: 'cobro_pago',
  foreignKey: 'cobro_id',
});
pagoAccionModel.belongsTo(cobroAccionModel, {
  as: 'pago_cobro',
  foreignKey: 'cobro_id',
});
