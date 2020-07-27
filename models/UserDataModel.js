'use strict'
var mongoose = require("mongoose");
var Schema = mongoose.Schema;



var UserDataSchema = new Schema
({
    user: String, //UserModel _id
});



var UserData = mongoose.model("UserData", UserDataSchema);
module.exports = UserData;