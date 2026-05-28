import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { usuarioModel } from './usuario.model.js';

export const auditoriaLogModel = sequelize.define(
  'auditoria_log',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: usuarioModel,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },

    tabla_afectada: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    registro_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    nombre_completo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    accion: {
      type: DataTypes.ENUM(
        'CREAR',
        'ACTUALIZAR',
        'ELIMINAR',
        'ANULAR',
        'HABILITAR',
        'DESHABILITAR',
      ),
      allowNull: false,
    },

    motivo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    datos_anteriores: {
      type: DataTypes.JSONB,
      allowNull: true,
    },

    datos_nuevos: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    tableName: 'auditoria_log',
    timestamps: true,

    indexes: [
      { fields: ['usuario_id'] },
      { fields: ['tabla_afectada'] },
      { fields: ['registro_id'] },
      { fields: ['accion'] },
      { fields: ['created_at'] },
    ],
  },
);

auditoriaLogModel.belongsTo(usuarioModel, {
  foreignKey: 'usuario_id',
  as: 'usuario',
});

usuarioModel.hasMany(auditoriaLogModel, {
  foreignKey: 'usuario_id',
  as: 'auditorias',
});
