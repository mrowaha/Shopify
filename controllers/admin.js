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
    const product = new Product({
        title : title, 
        price : price, 
        description : description, 
        imageUrl : imageUrl,
        userId : req.user //mongoose picks the _id
    }); 
    product
    .save() 
    .then(() => {
        console.log('Product created')
        res.redirect('/admin/products')
    })
    .catch(err => {
        console.log(err);
    })
};

exports.getProducts = (req, res, next) => {
    Product.find()
        // .select('title price -_id') //this selects the title and price only (does not select the id which is always retrieved unless explicitly excluded)
        // .populate('userId', 'name') //populates the userId field with the user document name field
        .then((products) => {
            console.log('Products fetched', products)
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
    Product.findById(prodId)
    .then(product => {
        if(!product){
            return res.redirect('/admin/products');
        }
        res.render('admin/edit-product', {
            product: product,
            docTitle: "Edit Product By Name",
            path: '/admin/edit-product',
            editing: editMode 
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

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            return product.save()
        })
        .then((result)=> {
            res.redirect('/admin/products'); 
        })
        .catch(err => {
            console.log(err);
        });
}
    
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
    .then( () => {
        console.log("Product Removed");
        res.redirect('/admin/products');
    })
    .catch(err  => {
        console.log(err);
    })
}