import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const pagosModel = sequelize.define('pagos', {
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
      model: 'cobro_accion',
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
    type: DataTypes.ENUM('EFECTIVO', 'QR'),
    allowNull: false,
  },
  fecha_pago: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  observaciones_pago: {
    type: DataTypes.STRING,
  },
  etado_pago: {
    type: DataTypes.ENUM('VALIDAD', 'ANULADO'),
    defaultValue: 'VALIDO',
  },
});
