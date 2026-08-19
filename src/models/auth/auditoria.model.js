import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { usuarioModel } from './usuario.model.js';

export const auditoriaModel = sequelize.define(
  'auditoria_log',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'auth_usuarios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    registro_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tabla_afectada: {
      type: DataTypes.ENUM('SOCIOS'),
      allowNull: false,
    },
    accion: {
      type: DataTypes.ENUM(
        'CREAR',
        'ACTUALIZAR',
        'ANULAR',
        'ACTIVAR',
        'INACTIVAR',
      ),
      allowNull: false,
    },
    nombre_completo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    datos_anteriores: {
      type: DataTypes.JSONB,
    },
    datos_nuevos: {
      type: DataTypes.JSONB,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'auditoria',
    timestamps: true,
  },
);

auditoriaModel.belongsTo(usuarioModel, {
  foreignKey: 'usuario_id',
  as: 'usuarioAuditoria',
});

usuarioModel.hasMany(auditoriaModel, {
  foreignKey: 'usuario_id',
  as: 'auditorias',
});
