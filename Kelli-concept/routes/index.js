/*  ************************* Ishaya sunday ************************
	Node started as a difficult concept for me so i decided to take it easy
	and i embraced the idea of building my web pages as tiny or micro systems 
	(Called Modules). Hope you find this helpful
*/
//Importing the express module and assigning it to the "router variable"
const express = require('express');
const router = express.Router();

// Route Get for the  Homepage
router.get('/', ensureAuthenticated, (req, res)=> {
	res.render('index');
});

//Logged in user Authentication Middleware
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in'); //MIMI Uncomment this if you want to display this on login page
		res.redirect('/users/login');
	}
}

//Exporting the whole router object and make it available to other directories
module.exports = router;