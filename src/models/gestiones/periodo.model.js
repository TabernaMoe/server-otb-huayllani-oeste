import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { gestionModel } from './gestion.model.js';

export const periodoModel = sequelize.define(
  'periodos',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    gestion_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: gestionModel,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    numero_mes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mes: {
      type: DataTypes.ENUM(
        'ENERO',
        'FEBRERO',
        'MARZO',
        'ABRIL',
        'MAYO',
        'JUNIO',
        'JULIO',
        'AGOSTO',
        'SEPTIEMBRE',
        'OCTUBRE',
        'NOVIEMBRE',
        'DICIEMBRE',
      ),
      allowNull: false,
    },

    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('ACTIVO', 'CERRADO'),
      defaultValue: 'ACTIVO',
    },
    fecha_cierre: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'periodos',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['gestion_id', 'mes'],
      },
    ],
  },
);

gestionModel.hasMany(periodoModel, {
  as: 'periodos',
  foreignKey: 'gestion_id',
});

periodoModel.belongsTo(gestionModel, {
  as: 'gestion',
  foreignKey: 'gestion_id',
});
