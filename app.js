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

mongoose.connect("mongodb+srv://Mukul:mukul@cluster0.azxd9.mongodb.net/yelpcamp?retryWrites=true&w=majority");

var campground=require("./models/campground");
var comment=require("./models/comment");
var User=require("./models/user");
var seedDB=require("./seeds");
var commentRoutes= require("./routes/comments"),
    campgroundRoutes=require("./routes/campgrounds"),
    indexRoutes= require("./routes/index");



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


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp has started!");
});