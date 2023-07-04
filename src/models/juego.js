'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Juego extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Jugador, {
        foreignKey: 'id'
      });
      this.hasMany(models.Casilla, {
        foreignKey: 'id'
      });
    }
  }
  Juego.init({
    codigo: DataTypes.STRING,
    turno: DataTypes.INTEGER,
    privado: DataTypes.BOOLEAN,
    numero_de_jugadores: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    fase: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Juego',
  });
  return Juego;
};