const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const rootDir = require('./util/path'); //absolute path for the main file
const env = require('./util/env');

const mongoConnect = require('./util/database').mongoConnect;

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorControllers = require("./controllers/error");

const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
    User.findById("637375b6339a805e60e986ff")
    .then(user => {
        console.log("User Logged In:\n", user);
        req.user = new User(user.name, user.email, user.cart, user._id);
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

mongoConnect(() => {
    if(require.main){
        app.listen(env.PORT, () => {
            console.log(`Server listening on Port ${env.PORT}`);
        })
    }
})