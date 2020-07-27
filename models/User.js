var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var dot = require('../plugins/Dot');
var task = require('../plugins/Task');
var UserData = require("./UserDataModel");


// User Schema
var UserSchema = new Schema
({
    name: String,
    phone: String, //Phone number would be awesome!
    pass: String,
    data: {type: String, default: "none"}, //UserData _id
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
        // creating and attaching an object to the user
        let myUserData = {user: user._id};
        let userData = new UserData(myUserData);
        let [e, userDataObj] = await task(userData.save());
        if(e) return next(e);
        user.data = userDataObj._id;
        return next();
    } 
});


// Expose the model to the server
UserSchema.statics.searchById = searchById;
var Model = mongoose.model("User", UserSchema);
module.exports = Model;