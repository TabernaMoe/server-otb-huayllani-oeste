import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { calleRamalModel } from './calleRamal.model.js';
import { socioModel } from '../socio.model.js';

export const accionModel = sequelize.define(
  'acciones',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    calle_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: calleRamalModel,
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
    direccion_accion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observacion_accion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nro_accion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado_accion: {
      type: DataTypes.ENUM('ACTIVO', 'PASIVO', 'ANULADO'),
      defaultValue: 'ACTIVO',
    },
  },
  {
    tableName: 'acciones',
    underscored: true,
    timestamps: true,
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
  foreignKey: 'calle_id',
});

accionModel.belongsTo(calleRamalModel, {
  as: 'accion_calle',
  foreignKey: 'calle_id',
});

//Tabla de muchos a muchos
