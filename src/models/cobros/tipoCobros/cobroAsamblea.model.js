import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { accionModel } from '../../accion/accion.model.js';
import { cobroModel } from '../cobro.model.js';
import { asistenciaAsambleaModel } from '../../asamblea/asistenciaAsamblea.model.js';

export const cobroAsamblea = sequelize.define(
  'cobro_asamblea',
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    asistencia_asamblea_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'asistencias_asamblea',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
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
    fecha_asamblea: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: 'cobro_asamblea',
    timestamps: true,
  },
);
