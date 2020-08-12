"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "user",
          "autoLoad",
          {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "user",
          "dailyEmails",
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "user",
          "testMigration",
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("user", "autoLoad", { transaction: t }),
        queryInterface.removeColumn("user", "dailyEmails", { transaction: t }),
        queryInterface.removeColumn("user", "testMigration", {
          transaction: t,
        }),
      ]);
    });
  },
};
