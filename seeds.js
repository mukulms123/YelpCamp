var mongoose=require("mongoose");
var campground=require("./models/campground");
var Comment= require("./models/comment");

var data=[
    {   name:'Mansoori', 
        image:"https://www.campgeorgeeverest.com/images/slider/slide1.jpg",
        description:"Badhia Jagah hai!"
    },
    {   name:"Devil\'s Hill", 
        image:"https://img.traveltriangle.com/blog/wp-content/uploads/2019/12/Camping-In-Mussoorie_20th-dec.jpg",
        description:"Badhia Jagah hai!"
    },
    {   name:'Dehradun', image:"https://www.campgeorgeeverest.com/images/slider/slide3.jpg",
        description:"Badhia Jagah hai!"
    }
]

function seedDB(){
    //removed all campgrounds
    campground.remove({},function(err){
        // if(err){
        //     console.log("error");
        // }
        // else{
        //     console.log("removed Campgrounds!");
        //     data.forEach(function(seed){
        //         campground.create(seed,function(err,campground){
        //             if(err){
        //                 console.log("Error occured in seed");
        //             }
        //             else{
        //                 console.log("Seed successful");
        //                 Comment.create({
        //                     text:"Awesome place, with good food.",
        //                     author:"Mukul"
        //                 },function(err,comment){
        //                     if(!err){
        //                         console.log("Comment added");
        //                         campground.comments.push(comment);
        //                         campground.save();
                                
        //                     }
        //                     else{
        //                         console.log("Seeds me error");
        //                     }
        //                 });
        //             }
        //         });
        //     });
        // }
    });
    console.log("Seed was called.");
}
module.exports= seedDB;