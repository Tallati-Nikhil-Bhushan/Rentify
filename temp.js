const Category = require("./backend/models/categories")

Category.findOneAndUpdate({"category":"Fashion"},{$addToSet:{"sub_categories":"footwear"}})

console.log(Category.find({}));