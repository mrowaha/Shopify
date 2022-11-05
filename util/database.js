const mysqlServer = require('mysql2');

const dbEnv = require('./env').DATABASE;

const pool = mysqlServer.createPool({
    host: dbEnv.host,
    user: dbEnv.user,
    database: dbEnv.database,
    password: dbEnv.password
});

module.exports = pool.promise();  