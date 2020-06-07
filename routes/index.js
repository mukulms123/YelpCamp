var express=require("express");
var router= express.Router();
var passport= require("passport");
var campground=require("../models/campground");
var comment= require("../models/comment");
var User= require("../models/user");


router.get("/",function(req,res){
    res.render("campgrounds/landing");
});

// ==================Auth routes==============//

router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    var user=new User({username : req.body.username})
    User.register(user, req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to YelpCamp-"+user.username);
            res.redirect("/campgrounds");
        });
    });
});

//==========Show login Form========
router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {   successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),function(req,res){
});

router.get("/logout",function(req,res){
    req.logOut();
    req.flash("success","Successfuly logged you out!");
    res.redirect("/campgrounds");
});

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     req.flash("error","Please login First!");
//     res.redirect("/login");
// }

module.exports=router;