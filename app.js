
const express = require("express");
require("events").EventEmitter.prototype._maxListeners = 100;
const path = require("path");
const hbs = require("hbs");
const http = require("http");
const app = express();
const server = http.createServer(app);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const { registerLimitter } = require('./web-server/routers/expressLimmiter')
// Get routers **************************************************
const userRouter = require("./web-server/routers/rout");
const adminRouter = require("./web-server/routers/admin");
const TwoFactorAuth = require("./web-server/routers/TwoFactorAuth.routes.js");
const depositRoute = require("./web-server/routers/deposit");
const withdrawRoute = require("./web-server/routers/withdraw");
const port = process.env.PORT || 8080;
//Cpannel Database Password  zUYuFWKaG{mo
// Configure and serving files
const publicDirPath = path.join(__dirname, "/web-server/web-folder/public");
const viewPath = path.join(__dirname, "/web-server/web-folder/views");
const partialDirctory = path.join(__dirname, "/web-server/web-folder/partials");

app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialDirctory);
app.use(express.static(publicDirPath));
// app.use(registerLimitter) //For security

app.use(express.json());
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Set up cokies *************************
app.use(cookieParser());

// COnfigure routers ******************************************
app.use(userRouter, adminRouter, TwoFactorAuth, depositRoute, withdrawRoute);

app.get("*", (req, res) => {
  res.send("Sorry This page is empty");
});

app.get("/error-page", (req, res) => {
  res.send("<h1>An Error Occured Please Tey Again Later</h1>");
});

server.listen(port, () => {
  console.log("Server runeeees on " + port);
});


// var http = require('http');
// var server = http.createServer(function(req, res) {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     var message = 'It works!\n',
//         version = 'NodeJS ' + process.versions.node + '\n',
//         response = [message, version].join('\n');
//     res.end(response);
// });
// server.listen();
