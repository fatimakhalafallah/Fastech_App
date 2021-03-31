const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', (req, res) => res.render('welcome'));

// Dashboard user
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
       ename:req.user.email
  })
);

// Dashboard Admin
router.get('/dashboardAd', ensureAuthenticated, (req, res) =>
  //res.render('dashboardAd')
      Ticket.find({},function(err,data){
        if(err) throw err;
        res.render("dashboardAd", {data:data});
      })
      
);

// User dashboard to Save User.
router.post('/index/dashboard', (req, res) => {
    const { email, message } = req.body;
    let errors = [];
    if(!message){
      errors.push({ msg: 'Please fill Required Filled' });
      res.render('login', errors)
      
    } else {
      const uTicket = new Ticket({
        message,
        email
      });
      uTicket.save()
                  .then(
                    uTicket=>{ 
                      req.flash(
                        'success_msg',
                        'You are Message Sent..'
                      );
                         res.redirect('/users/login');})
                  .catch(err=>console.log(err))
    }
});


module.exports = router;