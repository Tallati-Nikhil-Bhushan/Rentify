if(process.env.NODE_ENV !== "production")
{
    require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStatergy = require('passport-local');
const User = require('./backend/models/user');
const userRoutes = require('./backend/routes/users');
const ExpressError = require('./backend/utils/ExpressError');
const productRoutes = require('./backend/routes/products');
const Category = require('./backend/models/categories');
const reviewRoutes = require('./backend/routes/reviews');


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

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


app.use(express.static(path.join(__dirname,'node_modules/bootstrap/dist/css')))
app.use(express.static(path.join(__dirname,'node_modules/bootstrap/dist/js')))
app.use(express.static(path.join(__dirname,'public')))
app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

const sessionConfig = {
    secret : 'thisshouldbeabettersecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now()+ 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    if(!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

app.use('/',userRoutes);
app.use('/products',productRoutes);
app.use('/products/:id/reviews',reviewRoutes);


app.get('/',(req,res)=>{
    res.render('home.ejs')
})


app.all('*',(req,res,next)=>{
    next(new ExpressError("Page Not Found",404))
})

app.use(async (err,req,res,next)=>{
    const categories = await Category.find({});
    const {statusCode=500} = err;
    if(!err.message) err.message = "oh No,something went wrong"
    res.status(statusCode).render('error',{err,categories});
})

app.listen(3000,()=>{
    console.log("listening on port 3000")
})