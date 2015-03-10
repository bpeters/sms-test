require('node-jsx').install({extension: '.jsx'});
var React = require('react');
var _ = require('lodash');
var config = require('config');

// Your accountSid and authToken from twilio.com/user/account
var accountSid = process.env.ACCOUNT_SID || config.get('Twilio.sid');
var authToken = process.env.AUTH_TOKEN || config.get('Twilio.token');
var client = require('twilio')(accountSid, authToken);

var App = require('../react/App.jsx');
var App = React.createFactory(App);

function paramsFromReq(req, data) {
	var params = _.clone(req.params);
	params.body = req.body;
	params.user = req.user;
	params.data = data;
	return params;
}

/*
	client.sendMessage({

			to:'+15125388383', // Any number Twilio can deliver to
			from: '+15125809414', // A number you bought from Twilio and can use for outbound communication
			body: 'word to your mother.' // body of the SMS message

	}, function(err, responseData) { //this function is executed when a response is received from Twilio

			if (!err) { // "err" is an error received during the request, if any

					// "responseData" is a JavaScript object containing data received from Twilio.
					// A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
					// http://www.twilio.com/docs/api/rest/sending-sms#example-1

					console.log(responseData.from); // outputs "+14506667788"
					console.log(responseData.body); // outputs "word to your mother."

			}
	});
*/

exports.index = function(req, res) {
	var messages = [];
	client.messages.list(function(err, data) {
		data.messages.forEach(function(message) {
				messages.push(message);
		});
		var params = paramsFromReq(req, messages[0].body);
		var markup = React.renderToString(App({
			title: 'Home',
			params: params
		}));
		res.send('<!DOCTYPE html>' + markup);
	});
};

exports.message = function(req, res) {
	console.log(req.body);
	res.send(null);
};
