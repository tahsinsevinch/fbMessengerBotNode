var express = require('express');
var fs = require('fs');
var request = require('request');
var bodyParser = require('body-parser');

var app = express.createServer();
//var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var token = "page acess token";
app.get('/', function(req, res) {
console.log('ok');
res.send('OK');
});
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] ==="verify token" ) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      sendTextMessage(sender, "Text received, echo: ");
    }
  }
  res.status(200).send('OK');
});

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}
app.listen(process.env.PORT);
//app.listen(process.env.PORT, function() {
//	console.log('uygulama çalışıyor');
//});
