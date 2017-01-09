'use strict';

const httpLib = require('http');
const express = require('express');

const app = express();
const http = httpLib.Server(app); // eslint-disable-line new-cap

// Deliver the public folder statically
app.use(express.static('.'));

// This tells the server to listen
var port = 4000;
http.listen(port, function () {
	console.log('Example app at http://localhost:' + port);
});
