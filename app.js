const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
dotenv.config({path: "./.env"})

const rootDir = require('./util/path'); //absolute path for the main file
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorControllers = require("./controllers/error");

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")))
app.get('/', (req, res, next) => {  
    res.redirect('/shop');
})
app.use('/shop', shopRoutes);
app.use('/admin', adminRoutes);


//catch all unhandled requests
app.use('/', errorControllers.get404);

//only listen if app is launched as a parent file
if(require.main){
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server is listening on Port ${PORT}`);
    });
}