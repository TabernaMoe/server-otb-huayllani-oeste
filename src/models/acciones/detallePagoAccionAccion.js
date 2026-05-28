import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { accionModel } from './accion.model.js';
import { detallePagoAccion } from './detallePagoAccion.model.js';

export const detalleAccionAccionModel = sequelize.define(
  'detalle_pago_accion_accion',
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
    detalle_accion_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      references: {
        model: detallePagoAccion,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
  },
  {
    tableName: 'detalle_pago_accion_accion',
    underscored: true,
    timestamps: false,
  },
);

accionModel.belongsToMany(detallePagoAccion, {
  as: 'accionesTipos',
  through: detalleAccionAccionModel,
  foreignKey: 'accion_id',
  otherKey: 'detalle_accion_id',
});

detallePagoAccion.belongsToMany(accionModel, {
  as: 'tipoAcciones',
  through: detalleAccionAccionModel,
  foreignKey: 'detalle_accion_id',
  otherKey: 'accion_id',
});
