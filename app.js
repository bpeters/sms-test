var express = require('express');
var app = express();
var path = require('path');
var swig  = require('swig');
var routes = require('./routes');
var model = require('./model');

app.use(express.static(path.join(__dirname, '/public')));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);
swig.setDefaults({ cache: false });

var bodyParser = require('body-parser');
var multer = require('multer');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

var request = require('request');
var options = {
  method: 'GET',
  json: {},
  uri: 'https://api.clever.com/v1.1/sections',
  headers: {
    Authorization: 'Bearer DEMO_TOKEN'
  }
};
var sumStudents = 0;
var sections = 0;
request(options, function(err, response, body) {
	sections = body.data.length;
	for (var i = 0; i < body.data.length; i++) {
		console.log(body.data[i].data.students.length);
		sumStudents = sumStudents + body.data[i].data.students.length;
	}
	console.log(sumStudents / sections);
});

//public routes
app.get('/', routes.index);
app.post('/sms/reply/', routes.message);

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		console.log(err);
		res.status(err.status || 500);
		res.send({
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.send({
		message: err.message,
		error: {}
	});
});
