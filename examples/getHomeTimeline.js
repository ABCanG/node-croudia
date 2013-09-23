var croudia = require('../lib/croudia'), //require('croudia'),
  util = require('util'),
  readline = require('readline');

// create instance
var crou = new croudia({
  consumer_key: 'consumer key here',
  consumer_secret: 'consumer secret here',
});

// read tokens
// input tokens here if you want to use config file
var tokens = {
  //access_token: 'last access token here',
  //refresh_token: 'last refresh token here'
};

if (tokens) {
  crou.options.access_token = tokens.access_token;
  crou.options.refresh_token = tokens.refresh_token;
}

// save tokens
crou.setTokenChangeListener(function(tokens) {
  console.log('--- change tokens listener ---');
  console.log(util.inspect(tokens));
  console.log('------------------------------');

  // save tokens if you want to use config file
});

// show authorize url
var authorizeUrl = crou.getAuthorizeUrl();
console.log('Open the browser the url below');
console.log('--- authorize url ---');
console.log(authorizeUrl);
console.log('---------------------');

// input authorized url
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('authorized url: ', function(answer) {
  rl.close();

  // croudia login
  crou.login(answer.trim(), function(err) {
    if (err) {
      console.log(err);
      return;
    }

    var params = {
      //'trim_user': 'true'
      //'include_entities': 'false'
    };

    // get home timeline
    crou.getHomeTimeline(params, function(err, data) {
      if (err) {
        console.log('--- error message ---');
        try {
          console.log(util.inspect(JSON.parse(err.data)));
        } catch (e) {
          console.log(util.inspect(err));
        }
        console.log('---------------------');

        return;
      }

      // show voicees
      console.log(util.inspect(data));
    });
  });
});

