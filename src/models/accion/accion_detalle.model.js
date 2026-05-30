import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { accionModel } from './accion.model.js';
import { detallePagoAccion } from './detallePagoAccion.model.js';

export const accionDetalleModel = sequelize.define(
  'accion_detalle',
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
    detalle_pago_accion_id: {
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
    tableName: 'accion_detalle',
    underscored: true,
    timestamps: false,
  },
);

accionModel.belongsToMany(detallePagoAccion, {
  as: 'accionesTipos',
  through: accionDetalleModel,
  foreignKey: 'accion_id',
  otherKey: 'detalle_pago_accion_id',
});

detallePagoAccion.belongsToMany(accionModel, {
  as: 'tipoAcciones',
  through: accionDetalleModel,
  foreignKey: 'detalle_pago_accion_id',
  otherKey: 'accion_id',
});
