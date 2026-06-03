import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { cobroModel } from './cobro.model.js';
import { accionDetalleModel } from '../accion/accion_detalle.model.js';

export const cobroAccionModel = sequelize.define(
  'cobro_accion',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: 'cobro_accion',
    timestamps: true,
  },
);

cobroModel.hasOne(cobroAccionModel, {
  as: 'cobroAccion',
  foreignKey: 'cobro_id',
});
cobroAccionModel.belongsTo(cobroModel, {
  as: 'accionCobro',
  foreignKey: 'cobro_id',
});
//

accionDetalleModel.hasOne(cobroModel, {
  as: 'accionCobro',
  foreignKey: 'accion_detalle_id',
});

cobroModel.belongsTo(accionDetalleModel, {
  as: 'CobroAccion',
  foreignKey: 'accion_detalle_id',
});
