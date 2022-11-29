const path = require('path');   

const express = require('express');
const router = express.Router();

//const rootDir = require('../util/path');
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth').isAuth;


router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductById);

router.post('/add-to-cart', isAuth, shopController.postCart);

router.get('/cart', isAuth, shopController.getCart);

 router.post('/cart-delete-item', isAuth, shopController.postCartDelete);

// router.get('/checkout', shopController.getCheckout);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);

module.exports = router;
