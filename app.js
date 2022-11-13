const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const rootDir = require('./util/path'); //absolute path for the main file
const env = require('./util/env');

const sequelize = require('./util/database'); 
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorControllers = require("./controllers/error");

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        console.log("User Logged In:\n", user);
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    });

})

app.get('/', (req, res, next) => {  
    res.redirect('/shop');
})
app.use('/shop', shopRoutes);
app.use('/admin', adminRoutes);


//catch all unhandled requests
app.use('/', errorControllers.get404);

//setup the table associations
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
User.hasOne(Cart);

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

//during development set force to true
sequelize
//.sync({force: true})
.sync()
.then(res => {
    //dummy user
    return User.findByPk(1);
    //only listen if app is launched as a parent file
})
.then(user => {
    if(!user){
        return User.create({
            name: "Rowaha",
            email: "dummy@gmail.com"
        });
    }
    return user;
})
.then(user => {
    //console.log(user);
    return user.createCart();
})
.then(cart => {
    if(require.main){
        const PORT = env.PORT;
        app.listen(PORT, () => {
            console.log(`Server is listening on Port ${PORT}`);
        });
    }
})
.catch(err => {
    console.log(err);
});