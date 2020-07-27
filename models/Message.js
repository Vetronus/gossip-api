var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var UserSchema = new Schema
({
    head: {type: String, default: "No Subject"},
    body: {type: String, required: true},
    to: {type: String, required: true},
    stamp: {type: Date, default: Date.now},
});


var Model = mongoose.model("User", UserSchema);
module.exports = Model;