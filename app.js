if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
} 


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listingrouter = require('./routes/listing.js'); 
const reviewrouter = require('./routes/review.js');
const userrouter = require('./routes/user.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');


app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate); //like creating  template and pasting the link where u want that template to be.



console.log(process.env.MAP_TOKEN);
//setting database

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

//setting views folder

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//setting public folder
app.use(express.static(path.join(__dirname,"/public")));

const port = 3000;
app.listen(port, () => {
  console.log("server is listening to port 3000");
});

//sessions
const sessionOptions = {
  secret:'mysupersecretcode', 
  resave : false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  },

};

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });


app.use(session(sessionOptions));
app.use(flash());

//passport(Authentication middleware)

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//accesing local 
app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

//passport  
// app.get('/demouser',async (req,res)=>{
//   let fakeuser = new User({
//     email : 'student@gmail.com',
//     username:'delta-student'
//   });
//  let registeredUser = await User.register(fakeuser,'helloworld');
//  res.send(registeredUser);
// })

app.use('/listings',listingrouter);
app.use('/listings/:id/reviews',reviewrouter);
app.use('/',userrouter);

//error handling middleware

app.all('*',(req,res,next)=>{
  next(new ExpressError(404,"Page not found!"))
});

app.use((err,req,res,next)=>{
 let {statusCode=500,message="Something went wrong"} = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render('error.ejs',{err});
});