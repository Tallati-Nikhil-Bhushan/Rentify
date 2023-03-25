const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/products');
const {isLoggedIn,isAuthor,validateProduct} = require('../middleware');
const products = require('../controllers/products');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/')
    .get(catchAsync(products.index))
    .post(isLoggedIn,upload.array('image'),validateProduct,catchAsync(products.createProduct))

router.get('/new',isLoggedIn,catchAsync(products.renderNewForm))

router.get('/category/:sub_category',catchAsync(products.findByCategory))

router.route('/:id')
    .get(catchAsync(products.showProducts))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateProduct,catchAsync(products.updateProduct))
    .delete(isLoggedIn,isAuthor,catchAsync(products.deleteProduct))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(products.renderEditForm))

module.exports = router

