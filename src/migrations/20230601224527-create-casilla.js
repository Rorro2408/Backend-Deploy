'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Casillas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      p_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Jugadors', key: 'id' }
      },
      g_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Juegos', key: 'id' }
      },
      tipo: {
        type: Sequelize.STRING
      },
      posicion_eje_x: {
        type: Sequelize.INTEGER
      },
      posicion_eje_y: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Casillas');
  }
};