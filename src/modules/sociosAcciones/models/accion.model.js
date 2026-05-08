import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { calleRamalModel } from './calleRamal.model.js';
import { socioModel } from './socio.model.js';

export const accionModel = sequelize.define(
  'acciones',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    calle_ramal_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: calleModel,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    socio_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: socioModel,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    codigo_interno_accion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nro_medidor_accion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    direccion_acciones: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observaciones_acciones: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nro_accion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado_accion: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO', 'ANULADO'),
      allowNull: false,
      defaultValue: 'ACTIVO',
    },
  },
  {
    tableName: 'acciones',
    underscored: true,
    timestamps: false,
  },
);

socioModel.hasMany(accionModel, {
  as: 'socio_accion',
  foreignKey: 'socio_id',
});
accionModel.belongsTo(socioModel, {
  as: 'accion_socio',
  foreignKey: 'socio_id',
});

calleRamalModel.hasMany(accionModel, {
  as: 'calle_acciones',
  foreignKey: 'calle_ramal_id',
});

accionModel.belongsTo(calleRamalModel, {
  as: 'accion_calle',
  foreignKey: 'calle_ramal_id',
});
