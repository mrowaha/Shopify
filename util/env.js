const path = require('path');

const rootDir = require('./path');
const dotenv = require('dotenv');
dotenv.config({path: path.join(rootDir, '.env')});

const env = {
    PORT: process.env.PORT,
    DATABASE: {
        host: process.env.SQLDB_HOST,
        user: process.env.SQLDB_USER,
        database: process.env.SQLDB_DATABASE,
        password: process.env.SQLDB_PASSWORD
    },
    DEVELOPMENT : {
        user : {
            username : process.env.DEV_USERNAME,
            email : process.env.DEV_EMAIL,
            mongodb_id : process.env.DEV_MONGODBID
        } 
    }

}

module.exports = env;