const path = require('path');
const fs = require('fs');

const rootDir = require('../util/path');
const Cart = require('../models/cart');

const productsDB = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (callback) => {
    fs.readFile(productsDB, (error, fileData) => {
        if(error){
            callback([]);
        }else{
            const products = JSON.parse(fileData);
            //console.log("Products retrieved from the database:\n" , products);
            callback(products); 
        }
    });
}

module.exports = class Product{
    static fetchAll(callback){ 
        getProductsFromFile(callback);
    }

    static findById(id, callback) {
        getProductsFromFile(products => {
            const productById = products.find(product => product.id === id);
            callback(productById);
        })
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(productsDB, JSON.stringify(updatedProducts), err => {
              if (!err) {
                Cart.deleteProduct(id, product.price);
              }
            });
          });
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
        getProductsFromFile(products => {
            if(this.id){
                const existingProductIndex = products.findIndex(product => product.id === this.id);
                const updatedProducts = [...products]; //doing this for immutability purposes
                updatedProducts[existingProductIndex] = this; //this was now a newly instantiated product so calling this
                fs.writeFile(productsDB, JSON.stringify(updatedProducts), (err) => {console.log(err?.message)});
            }else{
                //if there was no id make a new product
                this.id = Math.random().toString();
                products.push(this); //because save is binded to the instantiated object we get this -> the object
                if(products){
                    fs.writeFile(productsDB, JSON.stringify(products), (err) => {console.log(err?.message)})
                }
            }
        })
    }

}