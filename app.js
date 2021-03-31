const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');



require('./config/passport')(passport);


//database configuration
const db = require('./config/keys').mongoURI;

// connect to database
mongoose.connect(db , {useNewUrlParser : true})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

//bodyparser
app.use(express.urlencoded({extended:false}));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash 
app.use(flash());


// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on  ${PORT}`));
