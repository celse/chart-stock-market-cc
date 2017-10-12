'use strict';

var express = require('express'),
    routes = require("./app/routes/index.js"),
    bodyParser = require("body-parser"),
    flash = require("connect-flash-plus");
    

var app = express();
require('dotenv').load();

//console.log('My Root :'+process.cwd())
app.use('/controller', express.static(process.cwd() + '/app/controller'));
app.use('/common', express.static(process.cwd() + '/app/common'));
app.use('/public', express.static(process.cwd() + '/public'));
//app.use('/common', express.static(process.cwd() + '/app/common'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

routes(app);

var port = process.env.PORT || 8080;
app.listen(port, function(){
    console.log('app Node.js listening on port ' + port + '...');
})