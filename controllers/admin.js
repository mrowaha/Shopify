const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: "Add Product", 
        path: '/admin/add-product',
        editing: false
    })}
    
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    //console.log(req.user.id);
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    })
    .then(result => {
        console.log('Created Product');
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
    .then((products) => {
        res.render('admin/product-list', {
            prods: products,
            docTitle: 'Admin Products',
            path: '/admin/products'
        })
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getEditProduct = (req, res, next) => {
     const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/admin/products');
    }
    const prodId = req.params.productId;
    Product.findByPk(prodId)
    .then(product => {
        if(!product){
            return res.redirect('/admin/products');
        }
        res.render('admin/edit-product', {
            product: product,
            docTitle: "Edit Product By Name",
            path: '/admin/edit-product',
            editing: editMode //make sure if the form is for adding new or editing
        })  
    })
    .catch(err => {
        console.log(err);
    })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    Product.findByPk(prodId)  
    .then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription;
        return product.save();
    })
    .then((result)=> {
        console.log(result);
        res.redirect('/admin/products'); 
    })
    .catch(err => {
        console.log(err);
    });
}
    
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
    .then(product => {
        return product.destroy();
    })
    .then(result => {
        console.log("Product Destroyed");
        res.redirect('/admin/products');
    })
    .catch(err  => {
        console.log(err);
    })
}