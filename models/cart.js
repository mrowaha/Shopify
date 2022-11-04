const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const cartDB = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
    static getCart(callback) {
        fs.readFile(cartDB, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if(err){
                return callback(null);
            }
            callback(cart);
        })
    }

    static addProduct(id, prodPrice) {
        //Fetch the previous cart from the file
        //analyze the cart -> find existing product
        //add new product or increase quantity
        fs.readFile(cartDB, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if(!err) {
                cart = JSON.parse(fileContent);
            }

            const existingProductIndex = cart.products.findIndex(product => product.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.quantity = updatedProduct.quantity + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            }else {
                updatedProduct = {id: id, quantity: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +prodPrice;
            fs.writeFile(cartDB, JSON.stringify(cart), (err) => {console.log(err?.message)});
        })
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(cartDB, (err, fileContent) => {
          if (err) {
            return;
          }
          const updatedCart = { ...JSON.parse(fileContent) };
          const product = updatedCart.products.find(prod => prod.id === id);
          if(!product){
            return;
          }
          const productQty = product.quantity;
          updatedCart.products = updatedCart.products.filter(
            prod => prod.id !== id
          );
          updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
          fs.writeFile(cartDB, JSON.stringify(updatedCart), err => {
            console.log(err);
          });
        });
      }
   
}