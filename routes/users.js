const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const mongoose = require('mongoose');


// user Model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Update Page
router.get('/Update', (req, res) => res.render('Update'));


/////  (register handling) //////
router.post('/register', (req, res) => {
    const { fname, lname , email, password, password2 } = req.body;
    let errors = [];
     // check require file
    if (!fname || !lname || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
      // passowrd not equeal passwd2
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }

     // password length
    if (password.length < 5) {
      errors.push({ msg: 'Password must be at least 5 characters' });
    }
    // Errors
    if (errors.length > 0) {
      res.render('register', {
        errors,
        fname,
        lname,
        email,
        password,
        password2
      });
    } else {
      // Validation Pass
      // check out the user dose not exist 
      User.findOne({email:email})
      .then( user=> {
        if(user){
          // USer exists
          errors.push({msg :'Already Register...'})
          res.render('register', {
            errors,
            fname,
            lname,
            email,
            password,
            password2
          });
        } else{
          const UserN = new User({
            fname,
            lname,
            email,
            password
          });

           //Password Hash(cost of processing data)
           bcrypt.genSalt(10, (err, salt) => 
            bcrypt.hash(UserN.password,salt,(err,hash)=>{
                  if(err) throw err;
                  UserN.password = hash; // pass Hash
                  UserN.save() // Save the new User
                  .then(
                    user=>{ 
                      req.flash(
                        'success_msg',
                        'You are now registered and can log in'
                      );
                         res.redirect('/users/login');})
                  .catch(err=>console.log(err))
            }));      
        }  

      });  
    }

    });
    
// Login
router.post('/login', (req, res, next) => {
     // to check user Role 
     const { email,passowrd} = req.body;
     User.findOne({email:email})
     .then( user =>{
        if(user.role=="2"){ /// admin user  dashbaord
           passport.authenticate('local', {
            successRedirect: '/dashboardAd',
            failureRedirect: '/users/login',
            failureFlash: true
          })(req, res, next);
      }
          else {  // regualar user dashboard
            passport.authenticate('local', {
              successRedirect: '/dashboard',
              failureRedirect: '/users/login',
              failureFlash: true
            })(req, res, next);
        }
    
    })
    .catch(err=>{
      passport.authenticate('local', {
        failureRedirect: '/users/login',
        failureFlash: true
      })(req, res, next);
    })
      
});

//Udpate user details
router.post('/Update', (req, res) =>{
    const {email,passowrd,fname ,lname} = req.body;
    User.findOne({email:email})
    .then(user=>{ 
         if(!user){ 
          req.flash(
            'error_msg',
            'Wrong Email and Password .....'
          );
          res.redirect('/users/login');
         }
         else{
         var newvalues = { $set:{fname:fname , lname: lname } };
         var myquery = { email: email };
         user.updateOne(myquery,newvalues , function(err, res){ if (err) throw err;})
         req.flash(
          'success_msg',
          'You Account Updated ..'
        );
           res.redirect('/users/login');
         }
       })
    .catch(err=>console.log(err))
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
})





module.exports = router;