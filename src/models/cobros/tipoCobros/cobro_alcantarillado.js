import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { accionModel } from '../../accion/accion.model.js';
import { cobroModel } from '../cobro.model.js';
import { accionDetalleModel } from '../../accion/accionDetalle.model.js';

export const cobroAccionAlcantarilladoModel = sequelize.define(
  'cobroAccionAlcantarillado',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    accion_alcantarillado_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'acciones_alcantarillado',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    cobro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cobros',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    accion_detalle_alcantarillado_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'accion_alcantarillado_detalle',
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
    tableName: 'cobro_accion_alcantarillado',
    timestamps: true,
  },
);
