// const mysqlServer = require('mysql2');
const Sequelize = require('sequelize');
const dbEnv = require('./env').DATABASE;

// const pool = mysqlServer.createPool({
//     host: dbEnv.host,
//     user: dbEnv.user,
//     database: dbEnv.database,
//     password: dbEnv.password
// });

const sequelize = new Sequelize(dbEnv.database, dbEnv.user, dbEnv.password, {dialect: 'mysql', host: dbEnv.host});

// module.exports = pool.promise();  
module.exports = sequelize;