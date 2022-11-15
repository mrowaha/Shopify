const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = async (cb) => {
    try {
        const client = await MongoClient.connect(`mongodb://localhost:27017`);
        console.log('Connected To MongoDB');
        _db = client.db('shopify'); 
        cb();
    }catch(err){
        console.log(err);
    }
}

const getDb = () => {
    if(_db){
        return _db;
    }
    throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;