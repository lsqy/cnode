var http = require('http');
var express = require('express');
var ecstatic = require('ecstatic');

var app = express();
app.use(ecstatic({ root: __dirname + '/dist' }));
http.createServer(app).listen(7777);

console.log('Listening on :7777');