const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    const callback = (products) => {
        res.render('shop/index',{
            prods: products,
            docTitle: 'Shop',
            path: '/'
        });
    }
    Product.fetchAll(callback);
}

exports.getProducts = (req, res, next) => {
    const callback = (products) => {
        res.render('shop/product-list',{
            prods: products,
            docTitle: 'All Products',
            path: '/products'
        });
    }   
    Product.fetchAll(callback);
}

exports.getProductById = (req, res, next) => {
    const prodId = req.params.productId;
    //console.log(prodId);
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {
            docTitle: prodId.title,
            path: '/products',
            product: product
        })
    })   
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    })
    res.redirect('/shop/cart')
}

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for(let product of products){
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if(cartProductData){
                    cartProducts.push({productData: product, qty: cartProductData.quantity });
                }
            }
            res.render('shop/cart', {
                docTitle: "Your Cart",
                path: "/cart",
                products: cartProducts,
                hasProducts: cartProducts.length > 0
            })
        })
    })
}

exports.postCartDelete = (req, res, next) => {
    const prodId = req.body.productId;
    //console.log(prodId);
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/shop/cart');
    });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        docTitle: "Checkout",
        path: "/checkout"
    })
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: "/orders",
        docTitle: "Orders"
    })
}

