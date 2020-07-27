'use strict'
const task = require(__dirname + "/../plugins/Task");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


async function verifyLogin(model, login){
    if(!login.phone || !login.pass) throw new Error("#400 Phone or password not provided.");
    
    const[e, account] = await task(model.findOne({phone: login.phone}));
    if(e && !e.nf) throw new Error(e);
    if(e && e.nf) throw new Error("#404 Account not found.");

    let [er, passMatched] = await task(bcrypt.compare(login.pass, account.pass));
    if(er && !er.nf) throw new Error(er);
    delete account.pass;
    if(passMatched) return account;
    else throw new Error("#403 Wrong Password!");
}


function generateToken(account){
    const signature = {};
    if(account.type) signature.admin = account._id;
    else signature.user = account._id;
    signature.tokenV = account.tokenV;

    const key = jwt.sign(signature, global.KEY);

    let responseObj = {key: key};
    responseObj.isAdmin = false;
    responseObj.verified = account.verified;
    if(account.type) responseObj.isAdmin = true;
    return responseObj;
}


async function decryptToken(token){
    try{
        const decoded = await jwt.verify(token, global.KEY);
        return decoded;
    }
    catch(e){
        return false;
    }
}


module.exports.verifyLogin = verifyLogin;
module.exports.generateToken = generateToken;
module.exports.decryptToken = decryptToken;