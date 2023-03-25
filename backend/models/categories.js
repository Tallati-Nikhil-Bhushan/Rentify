const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
    category : String,
    sub_categories : [String]
})

module.exports = mongoose.model('Category',CategoriesSchema);