import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { CategoriaGastosModel } from './categoriaGasto.model.js';

export const EgresosModel = sequelize.define(
  'Egresos',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    categoria_egreso_id: { type: DataTypes.INTEGER, allowNull: false },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    concepto: { type: DataTypes.STRING, allowNull: false },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    beneficiario: { type: DataTypes.STRING, allowNull: false },
    observaciones: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: 'egresos',
    timestamps: true,
  },
);

CategoriaGastosModel.hasMany(EgresosModel, {
  as: 'egresos',
  foreignKey: 'categoria_egreso_id',
});

EgresosModel.belongsTo(CategoriaGastosModel, {
  as: 'categoria',
  foreignKey: 'categoria_egreso_id',
});
