var request = require('request');
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
var options = {
  'method': 'GET',
  'url': 'http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=tiagodscs&api_key=a5a97029436ae2465f6da09ead203ceb&format=json',
  'headers': {
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});