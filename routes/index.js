require('node-jsx').install({extension: '.jsx'});
var React = require('react');
var _ = require('lodash');
var config = require('config');

var twilioSid = process.env.TWILIO_ACCOUNT_SID || config.get('Twilio.sid');
var twilioToken = process.env.TWILIO_AUTH_TOKEN || config.get('Twilio.token');
var client = require('twilio')(twilioSid, twilioToken);

var wit = require('node-wit');
var witToken = process.env.WIT_AUTH_TOKEN || config.get('Wit.token');

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
		wit.captureTextIntent(witToken, messages[0].body, function (err, witRes) {
			var params = paramsFromReq(req, witRes);
			var markup = React.renderToString(App({
				title: 'Home',
				params: params
			}));
			res.send('<!DOCTYPE html>' + markup);
		});
	});
};

exports.message = function(req, res) {
	var message;
	wit.captureTextIntent(witToken, req.body.Body, function (err, witRes) {
		if (err) console.log("Error: ", err);
		console.log(JSON.stringify(witRes, null, " "));
		if (!witRes.outcomes) {
			message = 'Uhm try again.';
		} else {
			message = witRes.outcomes[0].intent;
		}
			client.sendMessage({
				to: req.body.From,
				from: '+15125809414',
				body: message
			}, function(err, responseData) {
				if (!err) {
					console.log(responseData.from);
					console.log(responseData.body);
				}
			});
	});
	res.send(null);
};
