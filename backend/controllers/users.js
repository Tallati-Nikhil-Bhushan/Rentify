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

const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Render forgot password page
module.exports.renderForgotPassword = async (req, res) => {
    const categories = await Category.find({})
    res.render('users/forgot-password',{categories});
};

// Handle forgot password request
module.exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot-password');
        }
        // Generate reset token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        // Send reset password email
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use Gmail as the email service provider
            auth: {
                user: 'rentify001@gmail.com', // Your Gmail email address
                pass: 'zlpl netu zcxx agrv' // Your Gmail password or application-specific password
            }
        });
        await transporter.sendMail({
            from: 'rentify001@gmail.com',
            to: user.email,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://${req.headers.host}/reset-password/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        });

        req.flash('success', 'An email has been sent to your email address with further instructions.');
        res.redirect('/forgot-password');
    } catch (error) {
        req.flash('error',e.message);
        res.redirect('/forgot-password');
    }
};

// Render reset password page
module.exports.renderResetPassword = async (req, res) => {
    const categories = await Category.find({})
    const { token } = req.params;
    res.render('users/reset-password', {categories,token});
};

// Handle reset password request
module.exports.resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Find user by reset token and check expiration
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            req.flash('error', 'Invalid or expired token');
            return res.redirect('/forgot-password');
        }

        // Update user's password
        await user.setPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        req.flash('success', 'Your password has been reset successfully.');
        res.redirect('/login');
    } catch (e) {
        req.flash('error',e.message);
        res.redirect('/forgot-password');
    }
};

