import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { rangoTarifaModel } from './rangoTarifa.model.js';

export const categoriaTarifa = sequelize.define(
  'categoria_tarifa',
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    nombre_categoria: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.STRING, allowNull: false },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'categoria_tarifa',
    underscored: true,
    timestamps: false,
  },
);

categoriaTarifa.hasMany(rangoTarifaModel, {
  as: 'rangos',
  foreignKey: 'categoria_tarifa_id',
});
rangoTarifaModel.belongsTo(categoriaTarifa, {
  as: 'tarifa',
  foreignKey: 'categoria_tarifa_id',
});
