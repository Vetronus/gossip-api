const fs = require("fs");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dot = require("./plugins/Dot");
const globals = require("./src/globals");


// Setup Express
const express = require("express");
const app = express();


// Allow CORS
const cors = require('cors');
const corsOptions = {
    credentials: true, // This is important.
	origin: (origin, callback) => {
        return callback(null, true);
	}
}
app.use(cors());
app.options('*', cors());


// setting global environment and var
let port = process.env.PORT || 5000;
globals.set();
if (!global.DEBUG) port = 80;


// set-up db connection
mongoose.Promise = Promise;
mongoose.set("useFindAndModify", false);
mongoose.connect(global.URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", (err) => console.error("DB Connection Error: ", err));
db.once("open", () => {
	console.log("DB Connected.");
	//boot();
});


// 3rd Party Middlewares
// app.use("/.well-known/acme-challenge", express.static("./verify"));
app.use("/files", express.static(global.FILES)); //GETs static assets
app.use(express.urlencoded({extended: false}));
app.use(express.json()); //Decodes Form Data
app.use(morgan("tiny")); //Logs requests


// import route files
const auth = require("./routes/auth");
const user = require("./routes/user");
const file = require("./routes/file");

// use the route
app.use(auth.decrypt); //decodes the auth token in every request
app.use('/auth', auth.router);
app.use('/user', user);
app.use('/file', file);

// middleware to handle err and res.
app.use(dot.handleRes);
app.use(dot.handleError);


// Server setup and bootup
const http = require("http").createServer(app);
const https = require("https");
let certPath = "/etc/letsencrypt/live/api.carbonexam.com/cert.pem";
if(global.DEBUG == false && fs.existsSync(certPath)){
	var server = https.createServer({
		key: fs.readFileSync("/etc/letsencrypt/live/api.carbonexam.com/privkey.pem"),
		cert: fs.readFileSync("/etc/letsencrypt/live/api.carbonexam.com/cert.pem"),
		ca: fs.readFileSync("/etc/letsencrypt/live/api.carbonexam.com/chain.pem"),
	},app);
	global.isHTTPS = true;
}
http.listen(port, () => console.log("NEM STACK | HTTP:", port));
if (global.isHTTPS) server.listen(443, () => console.log("NEM STACK| HTTPS:443"));