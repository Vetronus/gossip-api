function installGlobalVariables() {
    
    process.env.TZ = 'Asia/Kolkata';
    let platform = "Macintosh | Home";
    global.DEBUG = true;
    global.FILES = "./uploads";
    global.KEY = "ArCS";
    if (process.platform === "darwin") {
        // global.URI = "mongodb+srv://admin:AlphaGod2205@paper-paydn.mongodb.net/paper?retryWrites=true&w=majority";
        global.URI = "mongodb://localhost:27017/gossip";
    } 
    else //if (process.env.isHeroku === "true") {
        {
        global.URI = "mongodb+srv://admin:AlphaGod2205@paper-paydn.mongodb.net/<dbname>?retryWrites=true&w=majority";
        platform = "Worker | Heroku";
    } 
    // else {
        // global.URI = "mongodb://[username]:[password]@db.[ursite].com:27017/[dbName]?authSource=admin";
        // platform = "Droplet | DigitalOcean";
        // global.DEBUG = false;
    // }

    console.log(platform);
}

module.exports.set = installGlobalVariables;