const path = require('path');

const rootDir = require('./path');
const dotenv = require('dotenv');
dotenv.config({path: path.join(rootDir, '.env')});

const env = {
    PORT: process.env.PORT,
    DATABASE: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD
    }
}

module.exports = env;