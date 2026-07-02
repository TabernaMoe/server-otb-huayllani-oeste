import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { cobroModel } from '../cobro.model.js';
import { lecturaAguaModel } from '../../lecturasAgua/lecturasAgua.model.js';

export const cobroAguaModel = sequelize.define(
  'cobro_agua',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lectura_agua_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'lecturas_agua',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    cobro_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'cobros',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    consumo_m3: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_pagar: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: 'cobro_agua',
    timestamps: true,
  },
);
