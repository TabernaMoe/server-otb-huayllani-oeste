import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { accionModel } from './accion.model.js';
import { tipoAccionModel } from './tipoAccion.model.js';

export const tipoAccionAccionModel = sequelize.define(
  'tipo_accion_accion',
  {
    accion_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      references: {
        model: accionModel,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    tipo_accion_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      references: {
        model: tipoAccionModel,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
  },
  { tableName: 'tipo_accion_accion', underscored: true, timestamps: false },
);

accionModel.belongsToMany(tipoAccionModel, {
  as: 'accionesTipos',
  through: tipoAccionAccionModel,
  foreignKey: 'accion_id',
  otherKey: 'tipo_accion_id',
});

tipoAccionModel.belongsToMany(accionModel, {
  as: 'tipoAcciones',
  through: tipoAccionAccionModel,
  foreignKey: 'tipo_accion_id',
  otherKey: 'accion_id',
});
