var express=require("express"),
    bodyparser= require("body-parser"),
    passport=require("passport"),
    LocalStrategy= require("passport-local"),
    mongoose= require("mongoose"),
    flash= require("connect-flash"),
    methodOverride= require("method-override");

var app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash());

mongoose.connect("mongodb://localhost/yelp_camp");

var campground=require("./models/campground");
var comment=require("./models/comment");
var User=require("./models/user");
var seedDB=require("./seeds");
var commentRoutes= require("./routes/comments"),
    campgroundRoutes=require("./routes/campgrounds"),
    indexRoutes= require("./routes/index");

// campground.create({
//     name:'Mansoori', 
//     image:"https://www.campgeorgeeverest.com/images/slider/slide1.jpg",
//     description:"Badhia Jagah hai!"
//     },function(error,campground){
//     if(!error){
//         console.log("Campground added.");
//         console.log(campground.name);
//     }
// });

// var campgrounds=[{name:'Dehradun', image:"https://www.campgeorgeeverest.com/images/slider/slide3.jpg"},
// {name:'Devil\'s Hill', image:"https://img.traveltriangle.com/blog/wp-content/uploads/2019/12/Camping-In-Mussoorie_20th-dec.jpg"},
// {name:'Mansoori', image:"https://www.campgeorgeeverest.com/images/slider/slide1.jpg"}];


// ==================Passport Configuration=======================//

app.use(require("express-session")({
        secret: "Fuck you",
        resave:false,
        saveUninitialized: false
    }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//pass currentuser info which are loged in
app.use(function(req,res,next){
    res.locals.currentUser= req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    next();
});

// Routes to Restful api's
app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);


app.listen(8000,'localhost',function(){
    console.log("YelpCamp has started!");
});