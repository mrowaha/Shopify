const Product = require('../models/product');

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
    console.log(prodId);
    res.redirect('/shop/cart')
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        docTitle: "Your Cart",
        path: "/cart"
    })
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


//The async await implementation when fetchall returns a new promise
// exports.getProducts = async (req, res, next) => {
//     try{
//         let products = await Product.fetchAll();
//         //const products = [];
        
//         res.render('shop', {
//             prods: products,
//             docTitle: 'My Shop', 
//             path: '/', 
//             hasProducts: products.length > 0,
//             activeShop: true,
//             productCss: true
//         });
//     }catch(error){
//         console.log(error);
//     }
// }
