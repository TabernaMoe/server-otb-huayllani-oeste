import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { accionModel } from '../../accion/accion.model.js';
import { cobroModel } from '../cobro.model.js';
import { accionDetalleModel } from '../../accion/accionDetalle.model.js';

export const cobroAccionModel = sequelize.define(
  'cobro_accion',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    accion_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'acciones',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
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
    accion_detalle_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'accion_detalle',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: 'cobro_accion',
    timestamps: true,
  },
);

accionModel.hasMany(cobroAccionModel, {
  as: 'accionesCobroAccion',
  foreignKey: 'accion_id',
});

cobroAccionModel.belongsTo(accionModel, {
  foreignKey: 'accion_id',
  as: 'cobroAccion',
});

cobroModel.hasOne(cobroAccionModel, {
  as: 'CobroAccionDetalle',
  foreignKey: 'cobro_id',
});
cobroAccionModel.belongsTo(cobroModel, {
  as: 'accionCobroDetalle',
  foreignKey: 'cobro_id',
});

accionDetalleModel.hasMany(cobroAccionModel, {
  as: 'cobrosAccionDetalle',
  foreignKey: 'accion_detalle_id',
});
cobroAccionModel.belongsTo(accionDetalleModel, {
  as: 'detalleAccion',
  foreignKey: 'accion_detalle_id',
});
