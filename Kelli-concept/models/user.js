/*  ************************* Ishaya sunday ************************
	Node started as a difficult concept for me so i decided to take it easy
	and i embraced the idea of building my web pages as tiny or micro systems 
	(Called Modules). Hope you find this helpful
*/

//Imports modules: "mongoose" for database interaction and "bcryptjs" for password hashing security
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Creating the User Schema
let UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

//Sets the exported Shema:"UserSchema" to the User variable
let User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser, callback)=> { //Creates and exports the module function: "createUser" for creating users 
	bcrypt.genSalt(10, (err, salt)=> {
	    bcrypt.hash(newUser.password, salt, (err, hash)=> { //Hashes the password typed in by the user
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

//Creates and exports the module function: "getUserByUsername" for fetching user by username
module.exports.getUserByusername = (username, callback)=> { 
	let query = {username: username}; 
	User.findOne(query, callback);
}

//Creates and exports the module function: "getUserById" for fetching users by Id
module.exports.getUserById = (id, callback)=> { 
	User.findById(id, callback);
}

//Creates and exports the module function: "createUSer" for creating users
module.exports.comparePassword = (candidatePassword, hash, callback)=> { 
	bcrypt.compare(candidatePassword, hash, (err, isMatch)=> {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}