const crypto = require('crypto')

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')

const env = require('../util/env')
const User = require('../models/user')

const transporter = nodemailer.createTransport({
    service : 'hotmail',
    auth : {
        user : env.MAILER.email,
        pass : env.MAILER.password
    }
})

exports.getLogin = (req, res, next) => {
    const isLoggedIn = req.session.isLoggedIn;

    let message = req.flash('error');
    if(message.length > 0){
        message = message[0]
    }else {
        message = null
    }
    res.render('auth/login', {
        path : '/login',
        docTitle : 'Login',
        isAuthenticated : isLoggedIn,
        errorMessage : message
    })
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0]
    }else {
        message = null
    }
    res.render('auth/signup', {
        path : 'signup',
        docTitle: 'Sign Up',
        isAuthenticated : false,
        errorMessage : message
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email : email})
    .then(user => {
        if(!user) {
            req.flash('error', 'Invalid email. User does not exist')
            return res.redirect('/auth/login');
        }
        bcrypt.compare(password, user.password)
        .then(matched => {
            if(matched) {
                req.session.user = user; //a mongoose model is stored, but cannot call any functions we define on our model
                req.session.isLoggedIn = true;   
                return req.session.save((err) => {
                    if(err){
                        console.log(err);
                    }
                    res.redirect("/")
                })
            }
            req.flash('error', 'Incorrect password')
            res.redirect('/auth/login');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/auth/login');
        }); 
    })
    .catch(err => {
        console.log(err);
    })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    
    User.findOne({email : email})
        .then(userDoc => {
            if(userDoc) {
                //user already exists with this email
                req.flash('error', 'Email already exists. Enter new email') 
                return res.redirect('/auth/signup');
            }
            //hash the password
            return bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
                const user = new User( {
                    email : email,
                    password :  hashedPassword,
                    cart  : {items : []}
                })
                return user.save();
    
            })
            .then(result => {
                const mailOptions = {
                    from : env.MAILER.email,
                    to : email,
                    subject : 'Account created on Shopify',
                    text : 'account created' 
                }
                transporter.sendMail(mailOptions, (err, info) => {
                    if(err){
                        console.log(err)
                    }else {
                        console.log(info.response)
                    }
                })

                res.redirect('/auth/login');
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

exports.getReset = (req, res, next) => {
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0]
    } else {
        message = null
    }    
    
    res.render('auth/reset', {
        path : 'reset',
        docTitle : 'Reset Password',
        errorMessage : message
    })
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, function(err, buffer) {
        if(err){
            req.flash('error', 'An error occured while generating token')
            console.log(err)
            return res.redirect('/auth/reset');
        }else {
            const token = buffer.toString('hex');
            User.findOne({email : req.body.email})
            .then(user => {
                if (!user){
                    req.flash('error', 'No account with email found');
                    res.redirect('/auth/reset')
                }else{
                    user.resetToken = token;
                    user.resetTokenExpiration = Date.now() + 3600000; //one hour expiration
                    user.save()
                    .then(() => {
                        const mailOptions = {
                            from : env.MAILER.email,
                            to : req.body.email,
                            subject : 'Pasword Reset | Shopify',
                            html: `
                                <p> Your requested a password reset </p>
                                <p> Click the link below to set a new password.</p>
                                <a href="http://localhost:4040/auth/reset/${token}">Reset</a>        
                            ` 
                        }
                        transporter.sendMail(mailOptions, (err, info) => {
                            if(err){
                                console.log(err)
                            }else {
                                console.log(info.response)
                            }
                        })
                        res.redirect('/');
                    })
                }           
            })
            .catch(err => {
                console.log(err);
            })

        }
    })
}