const env = require('../util/env')
const User = require('../models/user')

exports.getLogin = (req, res, next) => {
    const isLoggedIn = req.session.isLoggedIn;
    res.render('auth/login', {
        path : '/login',
        docTitle : 'Login',
        isAuthenticated : isLoggedIn
    })
}

exports.postLogin = (req, res, next) => {
    User.findById(env.DEVELOPMENT.user.mongodb_id)
    .then(user => {
        req.session.user = user; //a mongoose model is stored, but cannot call any functions we define on our model
        req.session.isLoggedIn = true;   
        req.session.save((err) => {
            if(err){
                console.log(err);
                return;
            }
            res.redirect("/")
        }) 
    })
    .catch(err => {
        console.log(err);
    })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if(err){
            console.log(err);
            return;
        }
        res.redirect('/');
    });    
}