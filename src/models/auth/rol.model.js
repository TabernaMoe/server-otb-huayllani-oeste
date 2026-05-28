import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { permisoModel } from './permiso.model.js';

export const rolModel = sequelize.define(
  'auth_roles',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre_rol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'auth_roles',
    timestamps: false,
  },
);

export const permisoRolModel = sequelize.define(
  'auth_rol_permisos',
  {
    rol_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      references: {
        model: rolModel,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    permiso_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      references: {
        model: permisoModel,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'auth_rol_permisos',
    timestamps: false,
  },
);

rolModel.belongsToMany(permisoModel, {
  through: permisoRolModel,
  as: 'permisos',
  foreignKey: 'rol_id',
  otherKey: 'permiso_id',
});

permisoModel.belongsToMany(rolModel, {
  through: permisoRolModel,
  as: 'roles',
  foreignKey: 'permiso_id',
  otherKey: 'rol_id',
});
