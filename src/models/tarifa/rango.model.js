import { sequelize } from '../../config/database.js';
import { DataTypes } from 'sequelize';
import { tarifaModel } from './tarifa.model.js';
export const rangoTarifaModel = sequelize.define(
  'tarifa_rango',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    tarifa_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: tarifaModel,
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
    tableName: 'tarifa_rango',
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
