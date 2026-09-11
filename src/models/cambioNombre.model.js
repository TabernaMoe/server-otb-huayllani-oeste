import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';
import { accionModel } from './accion/accion.model.js';
import { socioModel } from '../models/socio.model.js';
import { usuarioModel } from '../models/auth/usuario.model.js';

export const cambiarNombreModel = sequelize.define(
  'CambiarNombre',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    accion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'acciones',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    socio_antiguo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'socios',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    socio_nuevo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'socios',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'auth_usuarios',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    socio_antiguo_snapshot: {
      type: DataTypes.STRING,
    },
    socio_nuevo_snapshot: {
      type: DataTypes.STRING,
    },
    tipo: { type: DataTypes.ENUM('FAMILIAR', 'AJENO'), allowNull: false },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    observacion: { type: DataTypes.STRING },
  },
  {
    tableName: 'cambiar_nombre',
    timestamps: true,
  },
);

accionModel.hasMany(cambiarNombreModel, {
  as: 'cambiosNombres',
  foreignKey: 'accion_id',
});
cambiarNombreModel.belongsTo(accionModel, {
  as: 'accionCambioNombre',
  foreignKey: 'accion_id',
});

socioModel.hasMany(cambiarNombreModel, {
  as: 'cambioNombreSocioAntiguo',
  foreignKey: 'socio_antiguo_id',
});
cambiarNombreModel.belongsTo(socioModel, {
  as: 'socioAntiguo',
  foreignKey: 'socio_antiguo_id',
});
socioModel.hasMany(cambiarNombreModel, {
  as: 'cambioNombreSocioNuevo',
  foreignKey: 'socio_nuevo_id',
});
cambiarNombreModel.belongsTo(socioModel, {
  as: 'socioNuevo',
  foreignKey: 'socio_nuevo_id',
});
