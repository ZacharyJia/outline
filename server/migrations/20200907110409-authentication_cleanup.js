'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      var res = await queryInterface.createTable('authentication_services',{
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: 'CHARACTER VARYING',
          allowNull: false
        },
        data: {
          type: 'JSONB',
          allowNull: true,
        },
        serviceId:{
          type: 'CHARACTER VARYING',
          allowNull: true,
          unique: true
        },
        authenticatableId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        authenticatableType: {
          type: 'CHARACTER VARYING'
        },
        createdAt: {
          type: 'TIMESTAMP WITH TIME ZONE',
          allowNull: false
        },
        updatedAt: {
          type: 'TIMESTAMP WITH TIME ZONE',
          allowNull: false
        }
      });

      //What indices do we need ?
     //await queryInterface.addIndex('a',['b']);

      //Remove from Users
      await queryInterface.removeColumn('users','service');
      await queryInterface.removeColumn('users','serviceId');
      await queryInterface.removeColumn('users','slackData');

      //Remove from Teams
      await queryInterface.removeColumn('teams','googleId');
      await queryInterface.removeColumn('teams','slackId');
      await queryInterface.removeColumn('teams','slackData');

      return res;
  },

  down: async (queryInterface, Sequelize) => {

      //Drop table
      queryInterface.dropTable('authentication_services');
      
      //Rollback User columns
      await queryInterface.addColumn('users','service',Sequelize.STRING,{
        allowNull: true
      });
      
      await queryInterface.addColumn('users','serviceId',Sequelize.STRING,{
        allowNull: true,
        unique: true
      });
      await queryInterface.addColumn('users','slackData',Sequelize.JSONB);

      //Rollback User columns
      await queryInterface.addColumn('teams','googleId',Sequelize.STRING,{
        allowNull: true
      });
      
      await queryInterface.addColumn('teams','slackId',Sequelize.STRING,{
        allowNull: true
      });
      
      return await queryInterface.addColumn('teams','slackData',Sequelize.JSONB);

  }
};
