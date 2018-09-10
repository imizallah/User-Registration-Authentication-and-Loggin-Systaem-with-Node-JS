//Importing our modules 
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');

//Connection to the local/mlab Database called Kelliz-concept
mongoose.connect('mongodb://localhost/kellizConcept'); //kelliz:kelliz2@ds217452.mlab.com:17452/kelliz-concept mongodb://localhost/kellizConcept
let db = mongoose.connection;

//Requiring the users.js and index.js routes exported from the into this route
const routes = require('./routes/index');
const users = require('./routes/users');

// Initializing the express framework to app
const app = express();

// Choosing a Views Templating Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// Using the BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// Set Static Folder for Public view
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator for user Validation
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash Module
app.use(flash());

// Global Variables
app.use((req, res, next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


//Calls in the import(**Both were required above**) Routes for use
app.use('/', routes);
app.use('/users', users);

// Set Your Routing Port or just do it down there (To either the environmental variable port "process.env.port" OR port 4040)
app.set('port', (process.env.PORT || 4040));

app.listen(app.get('port'), ()=>{
	console.log('kelliz-concept Server started on port ' + app.get('port'));
});