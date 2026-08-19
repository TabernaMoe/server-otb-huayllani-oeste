import { sequelize } from '../../config/database.js';
import { DataTypes } from 'sequelize';
import { tarifaModel } from './tarifa.model.js';
export const rangoTarifaModel = sequelize.define(
  'TarifaRango',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tarifa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tarifas',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    consumo_minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    consumo_maximo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: 'tarifas_rango',
    timestamps: true,
  },
);

tarifaModel.hasMany(rangoTarifaModel, {
  foreignKey: 'tarifa_id',
  as: 'rangosTarifa',
});
rangoTarifaModel.belongsTo(tarifaModel, {
  foreignKey: 'tarifa_id',
  as: 'tarifa',
});
