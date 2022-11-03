const path = require('path');
const fs = require('fs');

const rootDir = require('../util/path');
const { resolve } = require('path');

const getProductsFromFile = (callback) => {
    const pathToFetch  =  path.join(rootDir, 'data', 'products.json');
    fs.readFile(pathToFetch, (error, fileData) => {
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
    //static products = [];
    static save_path = path.join(rootDir, 'data', 'products.json');
    
    static fetchAll(callback){ 
        getProductsFromFile(callback);
    }

    static findById(id, callback) {
        getProductsFromFile(products => {
            const productById = products.find(product => product.id === id);
            callback(productById);
        })
    }
    
    constructor(title, imageUrl, description, price){
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.save = this.save.bind(this);
    }

    save() {
        this.id = Math.random().toString();
        getProductsFromFile(products => {
            products.push(this); //because save is binded to the instantiated object we get this -> the object
            if(products){
                fs.writeFile(Product.save_path, JSON.stringify(products), (err) => {console.log(err.message)})
            }
        }) 
        //Product.products.push(this);
        // fs.readFile(Product.save_path, (error, data) => {
        //     let products = [];
        //     if(error){
        //         console.log(error.message);
        //     }else{
        //         products = JSON.parse(data);
        //         console.log('File Content:', data);
        //     }
        //     products.push(this);
        //     fs.writeFile(Product.save_path, JSON.stringify(products), (err) => {console.log(err.message)});
        // });     
    }
}