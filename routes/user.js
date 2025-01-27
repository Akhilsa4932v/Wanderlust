const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const WrapAsync = require("../utils/WrapeAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require('../controller/users.js');


router.route('/signup')
  .get(usercontroller.renderSignupForm)
  .post(WrapAsync(usercontroller.signup));

router.route('/login')
    .post(
        saveRedirectUrl,
        passport.authenticate('local',{
        failureRedirect:'/login',
        failureFlash:true,
        }),
        usercontroller.login)
    .get(usercontroller.renderLoginForm);

  
  //logout
    router.get('/logout',usercontroller.logout);


module.exports = router;