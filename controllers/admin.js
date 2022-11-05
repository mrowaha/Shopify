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
    const product = new Product(null, title, imageUrl, description, price);
    product.save() 
    .then(() => {
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(([rows, metaData]) => {
        res.render('admin/product-list', {
            prods: rows,
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
    Product.findById(prodId, (product) => {
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
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);
    updatedProduct.save();
    res.redirect('/admin/products');
}
    
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
}