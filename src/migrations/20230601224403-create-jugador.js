'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jugadors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      u_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Usuarios', key: 'id' }
      },
      g_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Juegos', key: 'id' }
      },
      nombre: {
        type: Sequelize.STRING
      },
      dinero: {
        type: Sequelize.INTEGER
      },
      soldados: {
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
    await queryInterface.dropTable('Jugadors');
  }
};