import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { usuarioModel } from './usuario.model.js';

export const personaAdminModel = sequelize.define(
  'PersonaAdmin',
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
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    cargo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cedula_identidad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ci_expedido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido_paterno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido_materno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'personas_admin',
    timestamps: true,
  },
);

usuarioModel.hasOne(personaAdminModel, {
  as: 'personaAdmin',
  foreignKey: 'usuario_id',
});
personaAdminModel.belongsTo(usuarioModel, {
  as: 'usuarioAdmin',
  foreignKey: 'usuario_id',
});
