const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const user = require('../controllers/users');

router.route('/register')
    .get(user.renderRegister)
    .post(catchAsync(user.register))

router.route('/login')
    .get(user.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo: true}),user.login)

router.get('/logout',user.logout)

module.exports = router;