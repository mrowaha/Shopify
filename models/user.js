const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

class User {
    static findById(id) {
        const db = getDb();
        return db.collection("users")
        .findOne({_id : new mongodb.ObjectId(id)})
    }

    constructor(username, email) {
        this.name = username;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db.collection("users").insertOne(this)
    }
}

module.exports = User;