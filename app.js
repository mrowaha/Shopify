const path = require('path');

const flash = require('connect-flash')
const csrf = require('csurf');
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

//config
const app = express();
const MONGODB_URI = `mongodb://localhost:27017/shopify`
const store = new MongodbStore({
    uri : MONGODB_URI,
    collection : 'sessions' 
});
const csrfProtection = csrf(); //stores in a session by default

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
app.use(csrfProtection);
app.use(flash())


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
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();    
})

app.get('/', (req, res, next) => {  
    res.redirect('/shop');
})

app.use('/shop', shopRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);


//catch all unhandled requests
app.use('/', errorControllers.get404);
app.use((err, req, res, next) =>{
    res.redirect('/');
})

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