import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { cobroModel } from '../../models/cobros/cobro.model.js';
import { pagoModel } from '../../models/cobros/pago.model.js';

export const pagoQrModel = sequelize.define(
  'pago_qr',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    pago_id: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      references: {
        model: 'pagos',
        key: 'id',
      },
    },
    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    qr_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    qr_image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    monto: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    moneda: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'BOB',
    },

    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    fecha_vencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    single_use: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    modify_amount: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    estado: {
      type: DataTypes.ENUM(
        'PENDIENTE',
        'PAGADO',
        'ANULADO',
        'VENCIDO',
        'ERROR',
      ),
      allowNull: false,
      defaultValue: 'PENDIENTE',
    },

    fecha_pago: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    hora_pago: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    monto_pagado: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },

    banco_origen: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    nombre_pagador: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    cuenta_pagador: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: 'pago_qr',
    timestamps: true,
    underscored: true,
  },
);

export const PagoQrDetalleModel = sequelize.define('pago_qr_detalle', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  cobro_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'cobros',
      key: 'id',
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  },
  pago_qr_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'pago_qr',
      key: 'id',
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  },
});
