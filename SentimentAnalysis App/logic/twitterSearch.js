//includes
var util = require('util'),
  twitter = require('twitter'),
  sentimentAnalysis = require('./sentimentAnalysis'),
  db = require('diskdb');

db = db.connect('db', ['sentiments']);

//config
var config = {
  consumer_key: 'rMoZTf2NdJ86JGzIlbRrJqgRA',
  consumer_secret: 'fgp1tQLA8p57Ww3vPoTrr1C175u2NyDsWDEeKreOv1flB07R5J',
  access_token_key: '3171932689-jJFugMumFW4hPpyNcrfh5Ifh9rQkvQgrVhqA7YF',
  access_token_secret: 'xdm4bgLZcVW9fS3U9n6oOWyWyYKspcInNoMj0ewUl7YWf'
}

module.exports = function(text, callback) {
  var twitterClient = new twitter(config);
  var response = [], dbData = []; // to store the tweets and sentiment
  twitterClient.search(text, function(data) {
    for (var i = 0; i < data.statuses.length; i++) {
      var resp = {};
      resp.tweet = data.statuses[i];
      resp.sentiment = sentimentAnalysis(data.statuses[i].text);
      dbData.push({
        "tweet" : resp.tweet.text,
        "score" : resp.sentiment.score
      });
      response.push(resp);
    };
    db.sentiments.save(dbData);
    callback(response);
  });
}
