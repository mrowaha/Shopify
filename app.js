const path = require('path');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongodbStore = require('connect-mongodb-session')(session);

const rootDir = require('./util/path'); //absolute path for the main file
const env = require('./util/env');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')
const errorControllers = require("./controllers/error");

const User = require('./models/user');
const authRouter = require('./routes/auth');

const app = express();
const MONGODB_URI = `mongodb://localhost:27017/shopify`
const store = new MongodbStore({
    uri : MONGODB_URI,
    collection : 'sessions' 
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")))
app.use(session({
    secret : env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false,
    store : store
}))

app.use((req, res, next) => {
    if(!req.session.user){
        next();
    }else{
        User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err=> {
            console.log(err)
        })
    }
})

app.get('/', (req, res, next) => {  
    res.redirect('/shop');
})

app.use('/shop', shopRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);


//catch all unhandled requests
app.use('/', errorControllers.get404);

mongoose
    .connect(MONGODB_URI) 
    .then((result) => {
        if(require.main){
            app.listen(env.PORT, () =>{
                console.log(`Server listening on PORT ${env.PORT}`)
            })
        }
    })
    .catch(err => {
        console.err(err);
    })