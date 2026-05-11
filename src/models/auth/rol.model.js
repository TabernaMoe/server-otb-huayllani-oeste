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
    underscored: true,
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
    },
    permiso_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      references: {
        model: permisoModel,
        key: 'id',
      },
    },
  },
  {
    tableName: 'auth_rol_permisos',
    underscored: true,
    timestamps: false,
  },
);

rolModel.belongsToMany(permisoModel, {
  through: permisoRolModel,
  as: 'rol_permiso',
  foreignKey: 'rol_id',
  otherKey: 'permiso_id',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

permisoModel.belongsToMany(rolModel, {
  through: permisoRolModel,
  as: 'permiso_rol',
  foreignKey: 'permiso_id',
  otherKey: 'rol_id',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
