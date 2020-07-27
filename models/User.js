var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var task = require('../plugins/Task');


// User Schema
var UserSchema = new Schema
({
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    pass: {type: String, required: true},
    encrypted: {type: Boolean, default: false},
    verified: {type: Boolean, default: false},
    notification: {type: Boolean, default: true},
    stamp: {type: Date, default: Date.now},
});


// hash the password before saving a new user
// create a data object and attach it to every new user account
UserSchema.pre('save', async function(next){
    let user = this;
    //if this object is being saved for the 1st time
    if(user.data === "none"){
        // hashing the password
        let [err, hashedPass] = await task(bcrypt.hash(user.pass, 4));
        if(err) return next(err);
        user.pass = hashedPass;
        //TODO: send verification email.
        return next();
    } 
});


var Model = mongoose.model("User", UserSchema);
module.exports = Model;