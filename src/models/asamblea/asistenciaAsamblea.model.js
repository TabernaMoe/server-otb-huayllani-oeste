import { sequelize } from '../../config/database.js';
import { DataTypes } from 'sequelize';
import { asambleaModel } from './asamblea.model.js';
import { accionModel } from '../accion/accion.model.js';

export const asistenciaAsambleaModel = sequelize.define(
  'asistencias_asamblea',
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    asamblea_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'asambleas',
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
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    asistio: {
      type: DataTypes.ENUM('ASISTIO', 'FALTA', 'SIN EFECTO'),
      defaultValue: 'ASISTIO',
    },
    observacion: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'asistencias_asamblea',
    timestamps: true,
  },
);
// asamblea.model.js
asambleaModel.hasMany(asistenciaAsambleaModel, {
  foreignKey: 'asamblea_id',
  as: 'asistencias',
});

asistenciaAsambleaModel.belongsTo(asambleaModel, {
  foreignKey: 'asamblea_id',
  as: 'asamblea',
});

// accion.model.js
accionModel.hasMany(asistenciaAsambleaModel, {
  foreignKey: 'accion_id',
  as: 'asistencias_asamblea',
});

asistenciaAsambleaModel.belongsTo(accionModel, {
  foreignKey: 'accion_id',
  as: 'accionAsamblea',
});
