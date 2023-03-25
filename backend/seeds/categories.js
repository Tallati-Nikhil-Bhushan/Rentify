const mongoose = require("mongoose");
const Category = require('../models/categories');

mongoose.set('strictQuery',true);

mongoose.connect('mongodb+srv://tallatinikhilbhushan:0y3Wbc6N5NrOI9c7@rentify.avnswhr.mongodb.net/rentify?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true,
    // useFindAndModify:false
});

const db = mongoose.connection;

db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected")
})


const cat_arr = ["Education","Entertainment","Fashion","Electronics","Properties","Furniture","Sports"]

const seedDB = async()=>{
    await Category.deleteMany({});
    for(let i=0;i<cat_arr.length;i++)
{
    const category = new Category({
        category:cat_arr[i],
        sub_categories:[]
    })

    await category.save();
}
}

seedDB().then(()=>{
    mongoose.connection.close();
})


