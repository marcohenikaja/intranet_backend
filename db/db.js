const Sequelize = require('sequelize');

const sequelize = new Sequelize('intranet', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});


module.exports = { sequelize };
