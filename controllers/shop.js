const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.findAll()
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
    Product.findAll()
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

exports.getProductById = (req, res, next) => {
    const prodId = req.params.productId;
    //console.log(prodId);
    Product.findByPk(prodId)
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
    let fetchedCart, newQuantity = 1;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts({where: {id: prodId}});
    })
    .then(products => {
        let product;
        if(products.length > 0){
            product = products[0];
        }
        if(product){
            //a part of cart already
            const oldQuantity = product.cartItem.quantity;
            newQuantity += oldQuantity;
            return product; 
        }
        //add a new product
        return Product.findByPk(prodId)
    })
    .then(product=> {
        return fetchedCart.addProduct(product, {through : {quantity : newQuantity}});
    })
    .then(() => {
        res.redirect('/shop/cart');
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
    .then(cart => {
        //console.log(cart);
        return cart.getProducts();
    })
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
    //console.log(prodId);
    req.user.getCart()
    .then(cart => {
        return cart.getProducts({where : {id : prodId}});
    })
    .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    })
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
    req.user.getOrders({include : ['products']}) //sequelize pluralizes the product table name
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
    let fetchedCart;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products =>{
        return req.user
        .createOrder()
        .then(order => {
            return order.addProducts(products.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
            }))
        })
        .catch(err => {
            console.log(err);
        })
    })
    .then(result => {
        return fetchedCart.setProducts(null);
    })
    .then(result => {
        res.redirect('/shop/orders');
    })
    .catch(err => {
        console.log(err);
    })
}