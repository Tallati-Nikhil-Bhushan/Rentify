const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile_no:{
        type:String,
        required:true,
        unique:true
    },
    products:[{
        type:Schema.Types.ObjectId,
        ref:'Product',
        required:false
    }],
    resetPasswordToken: String, // Store the hashed token
    resetPasswordExpires: Date, // Token expiration timestamp
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);