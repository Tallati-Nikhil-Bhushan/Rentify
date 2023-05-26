const User = require('../models/user');
const mongoose = require('mongoose');
const Category = require('../models/categories');

module.exports.renderRegister = async(req,res)=>{
    const categories = await Category.find({})
    res.render('users/register',{categories});
}

module.exports.register = async(req,res)=>{
    try
    {
    const {username,email,mobile_no,password} = req.body;
    const user = new User({email,mobile_no,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser,err=>{
        if(err)
        {
            return next(err)
        } 
        else
        {
            req.flash('success','Welcome to Rentify');
            res.redirect('/');
        }
    })
    }
    catch(e)
    {
        req.flash('error',e.message);
        res.redirect('/register')
    }
}

module.exports.renderLogin = async(req,res)=>{
    const categories = await Category.find({})
    res.render('users/login',{categories});
}

module.exports.login = (req,res)=>{
    req.flash('success','welcome back');
    const redirectUrl = req.session.returnTo || '/';
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success','good bye');
        res.redirect('/');
      });
}