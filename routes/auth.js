'use strict'
const express = require("express");
const router = express.Router();
const Auth = require(__dirname + "/../plugins/Auth");
const User = require(__dirname + "/../models/User");
const Admin = require(__dirname + "/../models/Admin");
const task = require(__dirname + "/../plugins/Task");


async function decrypt(req, res, next){
    let token = req.header('x-auth-token');
    if(!token) {
        req.auth = false;
        return next();
    }

    const decoded = await Auth.decryptToken(token);
    if(!decoded) return next(new Error("#403 Token authenticaton failed!"));
    req.auth = decoded;
    return next();
}


async function authenticateUser(req, res, next){
    let login = req.body;
    
    const[e, account] = await task(Auth.verifyLogin(User, login));
    if(e) return next(e);

    let token = Auth.generateToken(account);
    if(!token) return next(new Error("#403 An error occured while generating token"));
    req.rd = token;
    return next();
}


async function verifyToken(req, res, next){
    let account;
    if(req.auth.user){
        const[e, user] = await task(User.findById(req.auth.user));
        if(e) return next(e);
        account = user;
    }
    else{
        const[e, admin] = await task(Admin.findById(req.auth.admin));
        if(e) return next(e);
        account = admin;
    }

    let validity = ((account.tokenV == req.auth.tokenV) && account.verified && !account.hide);
    req.rd = validity;
    return next();
}


router.post("/user", authenticateUser);
router.get("/verify", verifyToken);


module.exports.router = router;
module.exports.decrypt = decrypt;