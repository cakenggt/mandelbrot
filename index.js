'use strict';

const httpLib = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const http = httpLib.Server(app); // eslint-disable-line new-cap

// parse application/json
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({extended: false}));

// Deliver the public folder statically
app.use(express.static('public'));

let apiOptions = {
	app: app
};

// Load the api versions
require('./api/v1')(apiOptions);

// This tells the server to listen
var port = process.env.PORT;
http.listen(port, function () {
	console.log('Example app listening on port ' + port + '!');
});

/*
* This tells the server to always serve index.html no matter what,
* excluding the previously defined api routes. This is so we can use
* react-router's browserHistory feature.
*/
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/html/index.html'));
});
