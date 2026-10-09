import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { accionModel } from '../accion/accion.model.js';
import { periodoModel } from '../gestiones/periodo.model.js';

export const lecturaAguaModel = sequelize.define(
  'lecturas',
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
    periodo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'periodos',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    lectura_anterior: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lectura_actual: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    consumo_m3: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    mora: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    periodo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observacion: {
      type: DataTypes.STRING,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    puede_editar: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    pude_editar_m3: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    puede_editar_mora: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    observacion_modificacion: {
      type: DataTypes.STRING,
    },
    observacion_mora: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'lecturas_agua',
    timestamps: true,
  },
);

accionModel.hasMany(lecturaAguaModel, {
  as: 'lecturas',
  foreignKey: 'accion_id',
});

lecturaAguaModel.belongsTo(accionModel, {
  as: 'lecturaAccion',
  foreignKey: 'accion_id',
});
//

periodoModel.hasMany(lecturaAguaModel, {
  as: 'peridoLecutra',
  foreignKey: 'periodo_id',
});
lecturaAguaModel.belongsTo(periodoModel, {
  as: 'lecturaPeriodo',
  foreignKey: 'periodo_id',
});
