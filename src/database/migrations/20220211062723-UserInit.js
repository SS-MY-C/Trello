'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
        up 需要返回一个 Promise
        queryInterface.createTable 方法用于创建表
            - 第一个参数是要创建的表的名称
            - 第二个参数是一个对象，用来描述表中包含的字段信息
            - queryInterface.createTable 返回一个 Promise
    */
    return queryInterface.createTable('User', {
      id: {
        type: Sequelize.INTEGER, // 字段类型：数字
        primaryKey: true,// 设置为主键
        autoIncrement: true// 自动增长
      },
      name: {
        type: Sequelize.STRING(20),// 字符串类型（20长度）
        unique: true,// 值唯一
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(32),// 字符串类型（32长度）
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,// 日期类型
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }, {
      charset: 'utf8mb4'
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
