const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const rootDir = require('./util/path'); //absolute path for the main file
const env = require('./util/env');

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
    User.findById(env.DEVELOPMENT.user.mongodb_id)
    .then(user => {
        req.user = user; //a mongoose model is stored, can call any member functions
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

mongoose.connect(`mongodb://localhost:27017/shopify`)
    .then(() => {
        return User.findOne().then(user => {
            if(!user){
                const {username, email} = env.DEVELOPMENT.user;   
                const user = new User({
                    username,
                    email,           
                    cart : {
                        items : []
                    }
                })    
                return user.save();
            }
        });
    })
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