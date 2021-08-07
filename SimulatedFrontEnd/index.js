
const express=require('express');
const serveStatic=require('serve-static');
var fs = require('fs')
var https = require('https')
var hostname="localhost";
var port=3001;
var app=express();

const httpsOptions = {
    key: fs.readFileSync('./cert/localhost.key'),
    cert: fs.readFileSync('./cert/localhost.crt')
}
app.use(function(req,res,next){
    console.log(req.url);
    console.log(req.method);
    console.log(req.path);
    console.log(req.query.id);
    //Checking the incoming request type from the client
    if(req.method!="GET"){
        res.type('.html');
        var msg='<html><body>This server only serves web pages with GET request</body></html>';
        res.end(msg);
    }else{
        next();
    }
});

app.use(serveStatic(__dirname+"/public"));

app.get("/", (req, res) => {
    res.sendFile("/public/home.html", { root: __dirname });
});
const server = https.createServer(httpsOptions, app)
    server.listen(port, () => {
       console.log('https://localhost:' + port)
    })