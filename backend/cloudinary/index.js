const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:"dekzwibfs",
    api_key:"396622398667881",
    api_secret:"M1latb3ivHhz_wJvUKZYpaAPhE0"
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'Rentify',
    allowedFormats:['jpeg','png','jpg']
    }
})

module.exports={
    cloudinary,
    storage
}