import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';
import { categoriaTarifa } from './categoriaTarifa.model.js';

export const rangoTarifaModel = sequelize.define(
  'rango_tarifa',
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    categoria_tarifa_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: categoriaTarifa,
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    consumo_minimo: { type: DataTypes.INTEGER, allowNull: false },
    consumo_maximo: { type: DataTypes.INTEGER, allowNull: false },
    precio_m3: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    tableName: 'rango_tarifa',
    underscored: true,
    timestamps: false,
  },
);
