import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { pagoAguaModel } from './pagoAgua.model.js';
import { cobroAguaModel } from './cobroAgua.model.js';

export const pagoQrAguaModel = sequelize.define(
  'pagoQrAgua',
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
        model: 'pago_agua',
        key: 'id',
      },
    },
    cobro_agua_id: {
      type: DataTypes.INTEGER,
      defaultValue: false,
      references: {
        model: 'cobro_agua',
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
    tableName: 'pago_qr_agua',
    timestamps: true,
  },
);

pagoAguaModel.hasOne(pagoQrAguaModel, {
  as: 'qrsAgua',
  foreignKey: 'pago_id',
});
pagoQrAguaModel.belongsTo(pagoAguaModel, {
  foreignKey: 'pago_id',
});
//
cobroAguaModel.hasOne(pagoQrAguaModel, {
  as: 'qrsCorbosAgua',
  foreignKey: 'cobro_agua_id',
});
pagoQrAguaModel.belongsTo(cobroAguaModel, {
  as: 'OrigenCobroQR',
  foreignKey: 'cobro_agua_id',
});
