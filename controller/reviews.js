const Listing = require("../models/listing.js");
const review = require("../models/review.js");

//Reviews route
module.exports.createreview = async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newreview = new review(req.body.review);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);
   
    await newreview.save();
    await listing.save();
    req.flash('success','New review created!');
    res.redirect(`/listings/${listing._id}`);
   };


   //delete review route
   module.exports.destroyReview = async (req,res)=>{
    let {id,reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash('success','Review Deleted!');

    res.redirect(`/listings/${id}`);
  };