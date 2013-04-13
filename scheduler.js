var express = require('express'),
	//mongoose = require('mongoose'),
	mers = require('mers');


var app = express();
// Configuration

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use('/rest', mers({ uri:'mongodb://localhost/hydro_pi_scheduler'}).rest());
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
});

module.exports = app;
