var express=require("express");
var router= express.Router();
var campground=require("../models/campground");
var comment= require("../models/comment");
var User= require("../models/user");


// ===========Comments===============
router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    campground.findById(req.params.id,function(err,found){
        if(!err){
            res.render("comments/new",{campgrounds:found});
        }
        else{
            console.log(err);
        }
    });
});

router.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    campground.findById(req.params.id,function(err,campgrounds){
        if(!err){
            comment.create(req.body.comment,function(error,comments){
                if(!err){
                    console.log(req.user.username);
                    comments.author.id=req.user._id;
                    comments.author.username= req.user.username;
                    comments.save();
                    campgrounds.comments.push(comments);
                    campgrounds.save();
                    req.flash("success","Comment added successfuly." );
                    res.redirect("/campgrounds/"+req.params.id);
                }else{
                    console.log(error);
                }
            });
        }
        else{
            console.log(err);
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


router.get("/campgrounds/:id/comments/:comment_id/edit",checkCommentOwnership,function(req,res){
    console.log("Edit route for comment.");
    var campground_id=req.params.id;
    comment.findById(req.params.comment_id, function(err,foundComment){
        if(err){
            console.error(err);
            console.log(err);
            
            res.redirect("back");            
        }
        else{
            res.render("comments/edit",{campground_id: campground_id, comment:foundComment});
        }
    });
});

router.put("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
    comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updated){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment updated successfuly.");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

router.delete("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
    comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success","Comment deleted successfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})



function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please login First!");
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id,function(err,comment){
            if(err){
                req.flash("error","Comment not found.");
                res.redirect("/login");
            }
            else{
                if(comment.author.id.equals(req.user._id) ){
                    next();
                }else{
                    req.flash("error","You don't have editing rights.");
                    res.redirect("back");
                }
            }
        });
        }else{
        console.log("You need to be logged in");
        req.flash("error","You need to be logged in");
        res.redirect("/login");
    }
    
}


module.exports=router;