const db = require('../util/database');

const rootDir = require('../util/path');
const Cart = require('../models/cart');

module.exports = class Product{
    static fetchAll(){ 
        return db.execute('SELECT * FROM products')
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);        
    }

    static deleteById(id) {
    
    }
    
    constructor(id, title, imageUrl, description, price){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.save = this.save.bind(this);
    }

    save() {
        return db.execute(`INSERT INTO products(title, price, imageUrl, description) VALUES (?, ?, ?, ?)`, 
        [this.title, this.price, this.imageUrl, this.description]);    
    }
}