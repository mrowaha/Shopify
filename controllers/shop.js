const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('shop/index',{
            prods: products,
            docTitle: 'Shop',
            path: '/'
        });
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('shop/product-list',{
            prods: products,
            docTitle: 'Shop',
            path: '/products'
        });
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getProductById = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then((product) => {
        res.render('shop/product-detail', {
            docTitle: product.title,
            path: '/products' ,
            product: product 
        })
    })
    .catch(err => {
        console.log(err);
    });   
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log(result);
        res.redirect('/shop/cart');
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
    .then(products => {
        res.render('shop/cart', {
            docTitle: "Your Cart",
            path: "/cart",
            products: products,
            hasProducts: products.length > 0
        })
    })
    .catch(err => {
        console.log(err);
    });
}

exports.postCartDelete = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
    .then(() => {
        res.redirect('/shop/cart');
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        docTitle: "Checkout",
        path: "/checkout"
    })
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders() //sequelize pluralizes the product table name
    .then(orders => {
        res.render('shop/orders', {
            path: "/orders",
            docTitle: "Orders",
            orders: orders
        })
    })
    .catch(err => {
        console.log(err);
    })
}

exports.postOrder = (req, res, next) => {
    req.user
    .addOrder()
    .then(() => {
        res.redirect('/shop/orders')
    })
    .catch(err => {
        console.log(err);
    })
}