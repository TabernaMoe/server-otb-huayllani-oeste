import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { usuarioModel } from './auth/usuario.model.js';

export const socioModel = sequelize.define(
  'socios',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'auth_usuarios',
        key: 'id',
      },
    },
    ci_socio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    ci_expedido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    primer_apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    segundo_apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_celular: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_telefono: {
      type: DataTypes.STRING,
    },
    genero: {
      type: DataTypes.ENUM('MASCULINO', 'FEMENINO'),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'socios',
    timestamps: true,
  },
);

usuarioModel.hasOne(socioModel, {
  as: 'socio',
  foreignKey: 'user_id',
});
socioModel.belongsTo(usuarioModel, {
  as: 'usuarioSocio',
  foreignKey: 'user_id',
});
