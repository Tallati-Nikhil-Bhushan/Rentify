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


const categoriesWithSubCategories = [
    {
        category: "Education",
        sub_categories: ["Books", "Online Courses", "Tutoring Services"]
    },
    {
        category: "Entertainment",
        sub_categories: ["Novels","Music Instruments"]
    },
    {
        category: "Fashion",
        sub_categories: ["Clothing Men","Clothing Women","Costumes"]
    },
    {
        category: "Electronics",
        sub_categories: ["Laptops", "Cameras","Mobile","Gaming"]
    },
    {
        category: "Properties",
        sub_categories: ["Houses", "Commercial Spaces","Vacation Rentals"]
    },
    {
        category: "Furniture",
        sub_categories: ["Chairs", "Tables", "Sofas","Dressing Tables"]
    },
    {
        category: "Sports",
        sub_categories: ["Fitness Equipment","Kits"]
    },
    {
        category: "Vehicles",
        sub_categories: ["Cars", "Motorcycles", "Bicycles","Electric Bike"]
    }
];

const seedDB = async () => {
    await Category.deleteMany({});
    for (const categoryData of categoriesWithSubCategories) {
        const { category, sub_categories } = categoryData;
        const newCategory = new Category({
            category,
            sub_categories
        });
        await newCategory.save();
    }
};

seedDB().then(()=>{
    mongoose.connection.close();
})


