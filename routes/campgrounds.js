var express=require("express");
var router= express.Router();
var campground=require("../models/campground");
var comment= require("../models/comment");
var User= require("../models/user");

router.get("/campgrounds",function(req,res){
    console.log(req.user);
    campground.find({},function(err,campgrounds){
        if(!err){
            console.log("Showing all CampGrounds");
            res.render("campgrounds/index",{campgrounds:campgrounds, currentUser: req.user});
        }
        else{
            console.log("Somehting happened in /campgrounds");
        }
    })
    
});

router.post("/campgrounds",isLoggedIn,function(req,res){
    var name=req.body.name;
    var price=req.body.price;
    var image=req.body.img;
    var desc=req.body.description;
    var author={
        id: req.user._id,
        username: req.user.username
    };
    var newCamp= {name: name,price:price, image: image, description: desc ,author: author};
    console.log(req.user);

    campground.create(newCamp,function(err,campgrounds){
        if(!err){
            console.log(campgrounds);

            res.redirect("/campgrounds");
        }
        else{
            console.log("Error in  post/campgrounds")
        }
    });

});

router.get("/campgrounds/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

router.get("/campgrounds/:id",function(req,res){
    campground.findById(req.params.id).populate("comments").exec(function(err,found){
        if(!err){
            console.log("renderning show template");
            console.log(found);
            res.render("campgrounds/show",{found:found});
        }
        else{
            console.log("Error in /campgrounds/id");
            console.log(err)
            res.redirect("/campgrounds");
        }
    });
});


router.get("/campgrounds/:id/edit",checkCampgroundOwnership,function(req,res){
        campground.findById(req.params.id,function(err,campground){
                    res.render("campgrounds/edit",{campground:campground});
            
        });
});

router.put("/campgrounds/:id/",checkCampgroundOwnership,function(req, res){
    
    campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updated){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            console.log(updated);
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


router.delete("/campgrounds/:id",checkCampgroundOwnership,function(req,res){
    campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
})





function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please login First!");
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id,function(err,campground){
            if(err){
                req.flash("error","Campground not found.");
                res.redirect("back");
            }
            else{
                if(campground.author.id.equals(req.user._id) ){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that" );
                    res.redirect("back");
                }
            }
        });
        }else{
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
    
}

module.exports=router;
