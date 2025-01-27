const express = require("express");
const router = express.Router();
const  WrapAsync = require("../utils/WrapeAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validatelisting} = require("../middleware.js");
const listingcontroller = require('../controller/lisiting.js');
const multer = require('multer');
const {storage} = require('../cloudconfig.js');
const upload = multer({storage}); 



router.route('/')
  .get(WrapAsync(listingcontroller.index))
  .post(isLoggedIn,upload.single('listing[image]'),validatelisting,
      WrapAsync(listingcontroller.createlisting));

 

      
  //NEW ROUTE
  
  router.get('/new',isLoggedIn,listingcontroller.renderNewForm);

router.route('/:id')
  .get( WrapAsync(listingcontroller.showlisting))
  .delete(isLoggedIn,isOwner,WrapAsync(listingcontroller.destroyListing))
  .put(isLoggedIn, isOwner,upload.single('listing[image]'),validatelisting,WrapAsync(listingcontroller.updateListing));
  
  
  // Edit Router
  
  router.get('/:id/edit',isLoggedIn,isOwner,WrapAsync(listingcontroller.renderEditForm));
  
  
  module.exports = router;