const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const {cloudinary} = require('../cloudinary')

const ImageSchema = new Schema({
    url:String,
    filename:String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const opts = {toJSON:{virtuals:true}};

const ProductSchema = new Schema({
    title:String,
    images:[ImageSchema],
    price:Number,
    description:String,
    location:String,
    category:String,
    sub_category:String,
    availability_status:String,

    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews : [
        {
            type:Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
},opts)

ProductSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/products/${this._id}">${this.title}</a></strong>
            <p>${this.description.substring(0,20)}...</p>
    `
})

ProductSchema.post('findOneAndDelete',async function(doc){
    if(doc)
    {
        for(let img of doc.images)
        {
            await cloudinary.uploader.destroy(img.filename);
        }

        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Product',ProductSchema);