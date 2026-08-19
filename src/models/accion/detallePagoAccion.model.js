import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { tipoAccionModel } from './tipoAccion.model.js';

export const detallePagoAccion = sequelize.define(
  'detalle_pago_accion',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tipo_accion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tipos_accion',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    nombre_accion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio_accion: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tipo_cobro: {
      type: DataTypes.ENUM('UNICO', 'MENSUAL'),
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'detalle_pago_accion',
    timestamps: true,
  },
);

tipoAccionModel.hasMany(detallePagoAccion, {
  as: 'DetallesPagoAccion',
  foreignKey: 'tipo_accion_id',
});
detallePagoAccion.belongsTo(tipoAccionModel, {
  as: 'tipoAccion',
  foreignKey: 'tipo_accion_id',
});
