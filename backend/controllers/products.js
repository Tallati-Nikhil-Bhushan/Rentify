const Product = require('../models/products');
const User = require('../models/user');
const {cloudinary} = require('../cloudinary')
const Category = require('../models/categories');


module.exports.index = async(req,res)=>{
    const products = await Product.find({})
    const categories = await Category.find({});
    res.render('products/index',{products,categories,"sub_category":"All Products"})
} 

module.exports.findByCategory = async(req,res)=>{
    const sub_category = req.params.sub_category
    const products = await Product.find({sub_category})
    const categories = await Category.find({});
    res.render('products/index',{products,categories,sub_category})
} 

module.exports.renderNewForm = async (req,res)=>{
    const categories = await Category.find({});
    res.render('products/new',{categories});
}

module.exports.showProducts = async (req,res)=>{
    const categories = await Category.find({});
    const product = await Product.findById(req.params.id).populate({
        path:'reviews',populate:{path:'author'}}).populate('author')
    if(!product)
    {
        req.flash('error','Cannot Find that Product');
        res.redirect('/products')
    }
    res.render('products/show',{product,categories});
}

module.exports.createProduct = async(req,res,next)=>{

    const product = new Product(req.body.product);
    product.images = req.files.map(f=>({url:f.path,filename:f.filename}));
    product.author = req.user._id;

    const user = await User.findById(req.user._id);
    user.products.push(product);

    await Category.updateOne({"category":req.body.product.category},{$addToSet:{"sub_categories":req.body.product.sub_category.trim()}})

    await product.save()
    await user.save()

    req.flash('success','Successfully Made New Product!')
    res.redirect(`/products/${product._id}`);
}

module.exports.updateProduct = async (req,res)=>{
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id,{...req.body.product})
    images=req.files.map(f=>({url:f.path,filename:f.filename}));
    product.images.push(...images);
    await product.save();
    if(req.body.deleteImages)
    {
        for(let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success','Successfully Updated Product');
    res.redirect(`/products/${product._id}`)
}

module.exports.deleteProduct = async (req,res)=>{
    const {id} = req.params;
    await User.findByIdAndUpdate(req.user._id,{$pull:{products:id}})
    await Product.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted Product')
    res.redirect("/products");
}

module.exports.renderEditForm = async(req,res)=>{
    const categories = await Category.find({});
    const {id}=req.params;
    const product = await Product.findById(id)
    if(!product)
    {
        req.flash('error','Cannot Find that Product');
        res.redirect('/products')
    }
    res.render("products/edit",{product,categories})
}