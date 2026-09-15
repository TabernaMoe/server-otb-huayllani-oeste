import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { calleRamalModel } from '../calleRamal.model.js';
import { socioModel } from '../socio.model.js';

export const accionAlcantarilladoModel = sequelize.define(
  'AccionAlcantarillado',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    socio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'socios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    calle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'calles_ramal',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    codigo_interno: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observacion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    paso_a_accion_agua: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'acciones_alcantarillado',
    timestamps: true,
  },
);

socioModel.hasMany(accionAlcantarilladoModel, {
  as: 'accionesAlcantarillado',
  foreignKey: 'socio_id',
});

accionAlcantarilladoModel.belongsTo(socioModel, {
  as: 'socioAlcantarillado',
  foreignKey: 'socio_id',
});

calleRamalModel.hasMany(accionAlcantarilladoModel, {
  as: 'accionesAlcantarilladoCalle',
  foreignKey: 'calle_id',
});
accionAlcantarilladoModel.belongsTo(calleRamalModel, {
  as: 'calleAlcantarillado',
  foreignKey: 'calle_id',
});
