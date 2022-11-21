const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema)
// const mongodb = require('mongodb');

// const getDb = require('../util/database').getDb;

// class Product{
//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products').find().toArray()
//         .then(products => {
//             return products;
//         }) 
//         .catch(err => {
//             console.log(err);
//         })
//     }

//     static findById(id) {
//         const db = getDb();
//         return db.collection('products').find({_id: new mongodb.ObjectId(id)}).next()
//         .then(product => {
//             return product;
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }

//     static deleteById(id) {
//         const db = getDb();
//         return db.collection('products').deleteOne({_id : new mongodb.ObjectId(id)})
//         .then(result => {
//             console.log("deleted");
//         })
//         .catch(err => {
//             console.err(err);
//         })
//     }

//     constructor(title, price, imageUrl, description, id, userId){
//         this.title = title;
//         this.price = price;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this._id = id? new mongodb.ObjectId(id) : null;
//         this.userId = userId;
//     }

//     save() {
//         const db = getDb();
//         let dbOp;
//         if(this._id){
//             //update the product
//             dbOp = db.collection('products').updateOne({_id : this._id}, {$set: this}) //replace all fields
//         } else {
//             dbOp = db.collection('products').insertOne(this);
//         }    
//         return dbOp
//         .then(result => {
//             console.log(result);
//         })
//         .catch(err => {
//             console.log(err);
//         }) 
//     }
// }

// module.exports = Product;