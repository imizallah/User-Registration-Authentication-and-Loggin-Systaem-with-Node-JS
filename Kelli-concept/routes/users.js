/*  ************************* Ishaya sunday ************************
	Node started as a difficult concept for me so i decided to take it easy
	and i embraced the idea of building my web pages as tiny or micro systems 
	(Called Modules). Hope you find this helpful
*/
//Importing modules and making them available to this script
const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Importing the user model(Schema) from the models directory
let User = require('../models/user');

//Creating the Register route and renders the register.handlebars page
router.get('/register', (req, res)=> {
	res.render('register');
});

//Creating the Login route and renders the login.handlebars page
router.get('/login', (req, res)=> {
	res.render('login');
});

// Register Customer (The POST request)
router.post('/register', (req, res)=> {
	// const name = req.body.name; //Uncomment this if you want a user to register with "Name" too
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;

	// Validation of Customer during registration
	// req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'A Password is required').notEmpty();
	req.checkBody('password2', 'You must retype your Password').notEmpty();
	req.checkBody('password2', 'Your Passwords do not match').equals(req.body.password);

	//Initializing the Validation error and placing it in a variable "error"
	let errors = req.validationErrors();

	//If there is a Customer Validation error
	if (errors) {
		res.render('register', { //This renders back the registration page incase of any errors and also return an error object "errors"
			errors: errors
		});
	}
	else {
		//Checking if email and username are already taken during registration
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i" //Checks if Username is taken
	}},  (err, user)=> { //
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i" //Checks if email is taken
		}},  (err, mail)=> {
				if (user || mail) { //If there is a user OR mail with thesame credentials
					res.render('register', { //Renders back the registration page If there is a user OR mail with thesame credentials
						user: user,
						mail: mail
					});
				}
				else { //Else If all Customer credentials are Validated
					let newUser = new User({
						// name: name,
						email: email,
						username: username,
						password: password
					});
					User.createUser(newUser, (err, user)=> { //Creates the New User object
						if (err) throw err; //If there is an error during creating a user, it will throw back the error
						console.log(user); // Displays the Newly created user in the Console
					});
         	req.flash('success_msg', 'You are registered as ' + username + ' and can now login'); //Succcess Message after registration
					res.redirect('/users/login'); //Redirects back to the login page After registration
				}
			});
		});
	}
});

//Passport begins Validation of user during login
passport.use(new LocalStrategy( //Makes use of the local strategy
 (username, password, done)=> {
		User.getUserByusername(username, (err, user)=> { //This function gets the user by id from the database
			if (err) throw err; //Displays an error if found
			if (!user) { //If the user is not in the database
				return done(null, false, { message: 'Unknown User' }); //Displays message: Unknown User back to user
			}

			//Compares the user password if it matches with the one in the database
			User.comparePassword(password, user.password, (err, isMatch)=> {
				if (err) throw err;
				if (isMatch) { //If the passwords match
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' }); //Display message: Invalid Password if the passwords dont match
				} 
			});
		});
	}));

passport.serializeUser( (user, done)=> {
	done(null, user.id);
});

passport.deserializeUser( (id, done)=> {
	User.getUserById(id, (err, user)=> {
		done(err, user);
	});
});

//Passport authenticates Post request from the login page when the Login button is hit
router.post('/login',
	passport.authenticate('local', { //Password uses the local authentication system
		successRedirect: '/', //Redirects to the Homepage if "success"
		failureRedirect: '/users/login', //Redirects back to the login page if "failure"
		failureFlash: true }), //Sets the falure flash messages to "true"
 	(req, res)=> { //Call back function 
		res.redirect('/'); //Redirects the user back to the Homepage after login
	});

//A get request for when the user hits the logout button
router.get('/logout', (req, res)=> {
	req.logout();

	req.flash('success_msg', 'You are logged out'); //connect-flash displays a success logout message

	res.redirect('/users/login'); //Redirects the Customer back to the login page after logout
});

//Exporting the whole router object and make it available to other directories
module.exports = router;