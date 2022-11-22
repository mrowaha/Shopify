const path = require('path');   

const express = require('express');
const router = express.Router();

//const rootDir = require('../util/path');
const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductById);

router.post('/add-to-cart', shopController.postCart);

router.get('/cart', shopController.getCart);

 router.post('/cart-delete-item', shopController.postCartDelete);

// router.get('/checkout', shopController.getCheckout);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);

module.exports = router;
