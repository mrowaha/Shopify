const Product = require('../models/product');
const Order = require('../models/order');


exports.getIndex = (req, res, next) => {
    Product.find()
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
    Product.find()
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
            res.redirect('/shop/cart');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getCart = (req, res, next) => {
    req.user
    .populate('cart.items.productId') //this does not return a promise
    .then(user => {
        const products = user.cart.items;
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
    req.user.removeFromCart(prodId)
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
    Order.find({"user.userId" : req.user._id})
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
    let products = []
    req.user
        .populate("cart.items.productId")
        .then(user => {
            products = user.cart.items.map(p => {
                return {quantity : p.quantity, product : {...p.productId._doc}}
            });
            const order = new Order({
                user : {
                    email : req.user.email,
                    userId : user._id
                },        
                products : products
            })
            return order.save();
        })
        .then(() => {
            return req.user.clearCart()
        })
        .then(() =>{
            res.redirect('/shop/orders')
        })
        .catch(err => {
            console.log(err);
        })
}