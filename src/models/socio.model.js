import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { usuarioModel } from './auth/usuario.model.js';

export const socioModel = sequelize.define(
  'socios',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: usuarioModel,
        key: 'id',
      },
    },
    ci_socio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    ci_expedido_socio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombres_socio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    primer_apellido_socio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    segundo_apellido_socio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_celular_socio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_telefono_socio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genero_socio: {
      type: DataTypes.ENUM('MASCULINO', 'FEMENINO'),
      allowNull: false,
    },
    estado_socio: {
      type: DataTypes.ENUM('HABILITADO', 'DESABILITADO'),
      allowNull: false,
    },
    direccion_socio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'socios',
    paranoid: true,
    underscored: true,
    timestamps: true,
  },
);

usuarioModel.hasOne(socioModel, {
  as: 'usuario_socio',
  foreignKey: 'user_id',
});
socioModel.belongsTo(usuarioModel, {
  as: 'socio_usuario',
  foreignKey: 'user_id',
});
