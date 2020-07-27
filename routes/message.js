'use strict'
const express = require("express");
const router = express.Router();
const Msg = require(__dirname + "/../models/Message");
const User = require(__dirname + "/../models/User");
const task = require(__dirname + "/../plugins/Task");


async function getMsgList(req, res, next){
    let filter = {};
    if(req.auth.user) filter.to = req.auth.user; 
    const [err, msgs] = await task(Msg.find(filter));
    if(err && !err.nf) return next(err);
    req.rd = msgs;
    return next();
}


async function getMsg(req, res, next){
    let msg_id = req.params.msg_id;
    const [err, msg] = await task(Msg.findById(msg_id));
    if(err) return next(err);
    req.rd = msg;
    return next();
}


async function newMsg(req, res, next)
{
    let newMsgInfo = req.body;
    let username = req.params.username;

    const [er, user] = await task(User.find({username: username}));
    if(er) return next(er);
    newMsgInfo.to = user._id;

    const [err, msg] = await task(Msg.create(newMsgInfo));
    if(err) return next(err);
    // TODO send email notification to the reciever.
    req.rd = msg;
    return next();
}


async function deleteMsg(req, res, next){
    let msg_id = req.params.msg_id;
    const [err, msg] = await task(Msg.findByIdAndDelete(msg_id));
    if(err) return next(err);
    req.rd = msg;
    return next();
}



router.get("/", getMsgList); // get a list of all mssgs
router.get("/:msg_id", getMsg); // show one message
router.post("/:username", newMsg); // send/create new msg
router.delete("/:msg_id", deleteMsg); // delete one msg, using its _id
module.exports = router;