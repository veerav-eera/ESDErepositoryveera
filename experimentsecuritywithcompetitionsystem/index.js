const express = require("express");
const cors = require('cors')
const config = require('./src/config/config');
const formData = require('express-form-data');
const logging = require('./src/middlewares/logging');
//const dummyUserFn = require('./src/middlewares/dummyUserFn');

let app = express();
app.use('*', cors());


//Server Settings
const PORT = 5000;
const path = require("path");
const bodyParser = require("body-parser");
const bootstrap = require("./src/bootstrap");

//https://github.com/ortexx/express-form-data#readme


//Parse data with connect-multiparty. 
app.use(formData.parse({}));
//Delete from the request all empty files (size == 0)
app.use(formData.format());
//Change the file objects to fs.ReadStream 
app.use(formData.stream());

app.use(formData.union());

app.set("view engine", "pug");
app.set("views", path.resolve("./src/views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Not using the following because the client side will be using
//formdata technique to send data. This is due to the web application
//has file submission functionality.
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));










//Express Router
const router = express.Router();
app.use(router);
const rootPath = path.resolve("./dist");

//All client side files are parked inside the dist directory.
//The client side files are compiled by using Gulp
//The actual code files which developers edit is at /src/assets
app.use(express.static(rootPath));
//Applied this middleware function to supply dummy user id for testing
//when I have not prepared the login functionality.
//router.use(dummyUserFn.useDummyUserForTesting); 
bootstrap(app, router);

//Index Page (Home public page)
router.get('/', (req, res, next) => {
    res.send('<html><title>Backend API system for experimenting security concept</title><body>This project provides only backend API support</body></html>');
    res.end();
});

router.use((err, req, res, next) => {
    if (err) {
        //Handle file type and max size of image
        return res.send(err.message);
    }
});

var https = require('https')
var fs = require('fs')
const httpsOptions = {
    key: fs.readFileSync('./cert/localhost.key'),
    cert: fs.readFileSync('./cert/localhost.crt')
}


//app.listen(PORT, err => {
//    if (err) return logging.info(`Cannot Listen on PORT: ${PORT}`);
//   logging.info(`Server is Listening on: https://localhost:${PORT}/`);
//});
const server = https.createServer(httpsOptions, app)
    server.listen(PORT , () => {
       console.log('https://localhost:' + PORT )
    })

