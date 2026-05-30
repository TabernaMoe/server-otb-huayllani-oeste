import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export const detallePagoAccion = sequelize.define(
  'detalle_pago_accion',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre_accion: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
