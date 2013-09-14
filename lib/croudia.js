var VERSION = '0.0.1',
  http = require('http'),
  querystring = require('querystring'),
  oauth = require('oauth'),
  Cookies = require('cookies'),
  fs = require('fs'),
  path = require('path'),
  Keygrip = require('keygrip'),
  mime = require('mime'),
  //streamparser = require('./parser'),
  util = require('util'),
  utils = require('./utils');
  keys = require('./keys');

function Croudia(options) {
  //FIXME
  if (!(this instanceof Croudia)) return new Croudia(options);

  var defaults = {
    consumer_key: null,
    consumer_secret: null,
    //access_token_key: null,
    //access_token_secret: null,

    headers: {
      'Accept': '*/*',
      'Connection': 'close',
      'User-Agent': 'node-croudia/' + VERSION
    },


    //secure: false, // force use of https for login/gatekeeper
    cookie: 'croudia_auth',
    cookie_options: {},
    cookie_secret: null
  };
  this.options = utils.merge(defaults, options, keys.urls);

  this.oauth = new oauth.OAuth2(
    this.options.consumer_key,
    this.options.consumer_secret,
    this.options.base_url,
    this.options.authorize_path,
    this.options.access_token_path,
    this.options.headers);
}
Croudia.VERSION = VERSION;
module.exports = Croudia;

/*
 * GET
 */
Croudia.prototype.get = function(url, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  if ( typeof callback !== 'function' ) {
    throw new Error('FAIL: INVALID CALLBACK.');
    return this;
  }

  if (url.charAt(0) == '/')
    url = this.options.rest_base + url;

  if (params)
    url = url + '?' + querystring.stringify(params)

  this.oauth.get(url, this.options.access_token, //FIXME access_tokenの取得方法
  function(error, data, response) {
    if ( error && error.statusCode ) {
      var err = new Error('HTTP Error '
        + error.statusCode + ': '
        + http.STATUS_CODES[error.statusCode]);
      err.statusCode = error.statusCode;
      err.data = error.data;
      callback(err);
    } 
    else if (error) {
      callback(error);
    }
    else {
      try {
        var json = JSON.parse(data);
      } 
      catch(err) {
        return callback(err);
      }
      callback(null, json);
    }
  });
  return this;
};


/*
 * POST
 */
Croudia.prototype.post = function(url, content, content_type, callback) {
  if (typeof content === 'function') {
    callback = content;
    content = null;
    content_type = null;
  } else if (typeof content_type === 'function') {
    callback = content_type;
    content_type = null;
  }

  if ( typeof callback !== 'function' ) {
    throw new Error('FAIL: INVALID CALLBACK.');
    return this;
  }

  if (url.charAt(0) == '/')
    url = this.options.rest_base + url;

  // Workaround: oauth + booleans == broken signatures
  if (content && typeof content === 'object') {
    Object.keys(content).forEach(function(e) {
      if ( typeof content[e] === 'boolean' )
        content[e] = content[e].toString();
    });
  }
  
  this.oauth.post(url,
    this.options.access_token,
    content, content_type,
  function(error, data, response) {
    if ( error && error.statusCode ) {
      var err = new Error('HTTP Error '
        + error.statusCode + ': '
        + http.STATUS_CODES[error.statusCode]
        + ', API message: ' + error.data);
      err.data = error.data;
      err.statusCode = error.statusCode;
      callback(err);
    } 
    else if (error) {
      callback(error);
    }
    else {
      try {
        var json = JSON.parse(data);
      } 
      catch(err) {
        return callback(err);
      }
      callback(null, json);
    }
  });
  return this;
};


/*
 * SEARCH (not API stable!)
 */
// Croudia APIが対応していない
//Croudia.prototype.search = function(q, params, callback) {
//  //FIXME
//  if (typeof params === 'function') {
//    callback = params;
//    params = {};
//  }
//
//  if ( typeof callback !== 'function' ) {
//    throw new Error('FAIL: INVALID CALLBACK.');
//    return this;
//  }
//
//  //var url = this.options.search_base + '/search.json';
//  var url = this.options.rest_base + 'search.json';
//  params = utils.merge(params, {q: q});
//  this.get(url, params, callback);
//  return this;
//};


/*
 * STREAM
 */
// Croudia APIが対応していない
//Croudia.prototype.stream = function(method, params, callback) {
//  //FIXME
//  if (typeof params === 'function') {
//    callback = params;
//    params = null;
//  }
//
//  // Iterate on params properties, if any property is an array, convert it to comma-delimited string
//  if (params) {
//    Object.keys(params).forEach(function(item) {
//      if (util.isArray(params[item])) {
//        params[item] = params[item].join(',');
//      }
//    });
//  }
//
//  var stream_base = this.options.stream_base,
//      self = this;
//
//  // Stream type customisations
//  if (method === 'user') {
//    stream_base = this.options.user_stream_base;
//  } 
//  else if (method === 'site') {
//    stream_base = this.options.site_stream_base;
//  } 
//
//
//  var url = stream_base + '/' + escape(method) + '.json';
//
//  var request = this.oauth.post(
//    url,
//    this.options.access_token_key,
//    this.options.access_token_secret,
//    params, null
//  );
//
//  var stream = new streamparser();
//
//  stream.destroySilent = function() {
//    if ( typeof request.abort === 'function' )
//      request.abort(); // node v0.4.0
//    else
//      request.socket.destroy();
//  };
//  stream.destroy = function() {
//    // FIXME: should we emit end/close on explicit destroy?
//    stream.destroySilent();
//
//    // emit the 'destroy' event
//    stream.emit('destroy','socket has been destroyed');
//  };
//
//  
//  stream.on('_data', processTweet);
//
//  function processTweet(tweet) {
//    if (tweet['limit']) {
//      stream.emit('limit', tweet['limit']);
//    }
//    else if (tweet['delete']) {
//      stream.emit('delete', tweet['delete']);
//    }
//    else if (tweet['scrub_geo']) {
//      stream.emit('scrub_geo', tweet['scrub_geo']);
//    }
//    else {
//      stream.emit('data', tweet);
//    }
//  }
//
//  request.on('response', function(response) {
//
//    // Any response code greater then 200 from steam API is an error
//    if(response.statusCode > 200) {
//      stream.destroySilent();
//      stream.emit('error', 'http', response.statusCode );
//    }
//    else
//    {
//      // FIXME: Somehow provide chunks of the response when the stream is connected
//      // Pass HTTP response data to the parser, which raises events on the stream
//      response.on('data', function(chunk) {
//        stream.receive(chunk);
//      });
//      response.on('error', function(error) {
//        stream.emit('error', error);
//      });
//      response.on('end', function() {
//        stream.emit('end', response);
//      });
//      
//      /* 
//       * This is a net.Socket event.
//       * When Croudia closes the connectionm no 'end/error' event is fired.
//       * In this way we can able to catch this event and force to destroy the 
//       * socket. So, 'stream' object will fire the 'destroy' event as we can see above.
//       */
//      response.on('close', function() {
//        stream.destroy();
//      });
//    }
//  });
//  request.on('error', function(error) {
//    stream.emit('error', error);
//  });
//  request.end();
//
//  if ( typeof callback === 'function' ) callback(stream);
//  return this;
//};

/*
 * Croudia 'O'AUTHENTICATION UTILITIES, INCLUDING THE GREAT
 * CONNECT/STACK STYLE Croudia 'O'AUTHENTICATION MIDDLEWARE
 * and helpful utilities to retrieve the twauth cookie etc.
 */
//Croudia.prototype.cookie = function(req) {
//  //FIXME
//  var keys = null;
//
//  //this make no sense !this.options.cookie_secret return always true or false
//  //if ( !this.options.cookie_secret !== null )
//  if(this.options.cookie_secret)
//    keys = new Keygrip(this.options.cookie_secret);
//  var cookies = new Cookies( req, null, keys )
//  var getState = this.options.getState || function (req, key) {
//    return cookies.get(key);
//  };
//
//  // Fetch the cookie
//  try {
//    var twauth = JSON.parse(getState(req, this.options.cookie));
//  } catch (error) {
//    var twauth = null;
//  }
//  return twauth;
//};

//Croudia.prototype.login = function(mount, success) {
//  //FIXME
//  var self = this,
//    url = require('url');
//
//  // Save the mount point for use in gatekeeper
//  this.options.login_mount = mount = mount || '/twauth';
//
//  // Use secure cookie if forced to https and haven't configured otherwise
//  if ( this.options.secure && !this.options.cookie_options.secure )
//    this.options.cookie_options.secure = true;
//  // Set up the cookie encryption secret if we've been given one
//  var keys = null;
//  //the same issue than above
//  //if ( !this.options.cookie_secret !== null )
//  if(this.options.cookie_secret)
//    keys = new Keygrip(this.options.cookie_secret);
//  // FIXME: ^ so configs that don't use login() won't work?
//
//  return function handle(req, res, next) {
//    // state
//    var cookies = new Cookies( req, res, keys )
//    var setState = self.options.setState || function (res, key, value) {
//      cookies.set(key, value, self.options.cookie_options);
//    };
//    var clearState = self.options.clearState || function (res, key) {
//      cookies.set(key);
//    };
//
//    var path = url.parse(req.url, true);
//
//    // We only care about requests against the exact mount point
//    if ( path.pathname !== mount ) return next();
//
//    // Set the oauth_callback based on this request if we don't have it
//    if ( !self.oauth._authorize_callback ) {
//      // have to get the entire url because this is an external callback
//      // but it's only done once...
//      var scheme = (req.socket.secure || self.options.secure) ? 'https://' : 'http://',
//        path = url.parse(scheme + req.headers.host + req.url, true);
//      self.oauth._authorize_callback = path.href;
//    }
//
//    // Fetch the cookie
//    var twauth = self.cookie(req);
//
//    // We have a winner, but they're in the wrong place
//    if ( twauth && twauth.user_id && twauth.access_token_secret ) {
//      res.writeHead(302, {'Location': success || '/'});
//      res.end();
//      return;
//
//    // Returning from Croudia with oauth_token
//    } else if ( path.query && path.query.oauth_token && path.query.oauth_verifier && twauth && twauth.oauth_token_secret ) {
//      self.oauth.getOAuthAccessToken(
//        path.query.oauth_token,
//        twauth.oauth_token_secret,
//        path.query.oauth_verifier,
//      function(error, access_token_key, access_token_secret, params) {
//        // FIXME: if we didn't get these, explode
//        var user_id = (params && params.user_id) || null,
//          screen_name = (params && params.screen_name) || null;
//
//        if ( error ) {
//          // FIXME: do something more intelligent
//          return next(500);
//        } else {
//          setState(res, self.options.cookie, JSON.stringify({
//            user_id: user_id,
//            screen_name: screen_name,
//            access_token_key: access_token_key,
//            access_token_secret: access_token_secret
//          }));
//          res.writeHead(302, {'Location': success || '/'});
//          res.end();
//          return;
//        }
//      });
//
//    // Begin OAuth transaction if we have no cookie or access_token_secret
//    } else if ( !(twauth && twauth.access_token_secret) ) {
//      self.oauth.getOAuthRequestToken(
//      function(error, oauth_token, oauth_token_secret, oauth_authorize_url, params) {
//        if ( error ) {
//          // FIXME: do something more intelligent
//          return next(500);
//        } else {
//          setState(res, self.options.cookie, JSON.stringify({
//            oauth_token: oauth_token,
//            oauth_token_secret: oauth_token_secret
//          }));
//          res.writeHead(302, {
//            'Location': self.options.authorize_url + '?'
//              + querystring.stringify({oauth_token: oauth_token})
//          });
//          res.end();
//          return;
//        }
//      });
//
//    // Broken cookie, clear it and return to originating page
//    // FIXME: this is dumb
//    } else {
//      clearState(res, self.options.cookie);
//      res.writeHead(302, {'Location': mount});
//      res.end();
//      return;
//    }
//  };
//};

//Croudia.prototype.gatekeeper = function(failure) {
//  //FIXME
//  var self = this,
//    mount = this.options.login_mount || '/twauth';
//
//  return function(req, res, next) {
//    var twauth = self.cookie(req);
//
//    // We have a winner
//    if ( twauth && twauth.user_id && twauth.access_token_secret )
//      return next();
//
//    // I pity the fool!
//    // FIXME: use 'failure' param to fail with: a) 401, b) redirect
//    //        possibly using configured login mount point
//    //        perhaps login can save the mount point, then we can use it?
//    res.writeHead(401, {}); // {} for bug in stack
//    res.end([
//      '<html><head>',
//      '<meta http-equiv="refresh" content="1;url=" + mount + "">',
//      '</head><body>',
//      '<h1>Croudia authentication required.</h1>',
//      '</body></html>'
//    ].join(''));
//  };
//};


/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

// Timeline resources

Croudia.prototype.getPublicTimeline = function(params, callback) {
  var url = '/statuses/public_timeline.json';
  this.get(url, params, callback);
  return this;
};

Croudia.prototype.getHomeTimeline = function(params, callback) {
  var url = '/statuses/home_timeline.json';
  this.get(url, params, callback);
  return this;
};

Croudia.prototype.getUserTimeline = function(params, callback) {
  var url = '/statuses/user_timeline.json';
  this.get(url, params, callback);
  return this;
};

Croudia.prototype.getMentions = function(params, callback) {
  var url = '/statuses/mentions.json';
  this.get(url, params, callback);
  return this;
};

//Croudia.prototype.getRetweetedByMe = function(params, callback) {
//  //FIXME
//  var url = '/statuses/retweeted_by_me.json';
//  this.get(url, params, callback);
//  return this;
//};

//Croudia.prototype.getRetweetedToMe = function(params, callback) {
//  //FIXME
//  var url = '/statuses/retweeted_to_me.json';
//  this.get(url, params, callback);
//  return this;
//};

//Croudia.prototype.getRetweetsOfMe = function(params, callback) {
//  //FIXME
//  var url = '/statuses/retweets_of_me.json';
//  this.get(url, params, callback);
//  return this;
//};

//Croudia.prototype.getRetweetedToUser = function(params, callback) {
//  //FIXME
//  var url = '/statuses/retweeted_to_user.json';
//  this.get(url, params, callback);
//  return this;
//};

//Croudia.prototype.getRetweetedByUser = function(params, callback) {
//  //FIXME
//  var url = '/statuses/retweeted_by_user.json';
//  this.get(url, params, callback);
//  return this;
//};

// Sasayaki resources

Croudia.prototype.updateStatus = function(text, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  var url = '/statuses/update.json';
  var defaults = {
    status: text
  };
  params = utils.merge(defaults, params);
  params = querystring.stringify(params);

  this.post(url, params, null, callback);
  return this;
};

Croudia.prototype.updateWithMediaStatus = function(text, media_path, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  var url = '/statuses/update_with_media.json';
  var defaults = {
    status: text
  };
  params = utils.merge(defaults, params);

  var self = this;

  fs.readFile(media_path, function(err, data) {
    if (err) throw err;

    var boundary = +new Date();
    var post_data = [];

    for (var name in params) {
      var fieldPart = '--' + boundary + '\r\n';
      fieldPart += 'Content-Disposition: form-data; name="' + name + '"\r\n\r\n';
      fieldPart += params[name] + '\r\n';
      post_data.push(new Buffer(fieldPart, 'utf8'));
    }

    var filePart = '--' + boundary + '\r\n';
    filePart += 'Content-Disposition: form-data; name="media"; filename="' + path.basename(media_path) + '"\r\n'
    filePart += 'Content-Type: ' + mime.lookup(media_path) + '\r\n\r\n'
    post_data.push(new Buffer(filePart, 'ascii'));
    post_data.push(new Buffer(data, 'utf8'));

    post_data.push(new Buffer('\r\n--' + boundary + '--', 'ascii'));


    var content = Buffer.concat(post_data);
    var contentType = 'multipart/form-data; boundary=' + boundary;

    self.post(url, content, contentType, callback);
  });

  return this;
};

Croudia.prototype.destroyStatus = function(id, callback) {
  var url = '/statuses/destroy/' + escape(id) + '.json';
  this.post(url, null, null, callback);
  return this;
};
Croudia.prototype.deleteStatus
  = Croudia.prototype.destroyStatus;

Croudia.prototype.showStatus = function(id, callback) {
  var url = '/statuses/show/' + escape(id) + '.json';
  this.get(url, null, callback);
  return this;
};
Croudia.prototype.getStatus
  = Croudia.prototype.showStatus;

//Croudia.prototype.retweetStatus = function(id, callback) {
//  //FIXME
//  var url = '/statuses/retweet/' + escape(id) + '.json';
//  this.post(url, null, null, callback);
//  return this;
//};

//Croudia.prototype.getRetweets = function(id, params, callback) {
//  //FIXME
//  var url = '/statuses/retweets/' + escape(id) + '.json';
//  this.get(url, params,  callback);
//  return this;
//};

//Croudia.prototype.getRetweetedBy = function(id, params, callback) {
//  //FIXME
//  var url = '/statuses/' + escape(id) + '/retweeted_by.json';
//  this.post(url, params, null, callback);
//  return this;
//};

//Croudia.prototype.getRetweetedByIds = function(id, params, callback) {
//  //FIXME
//  var url = '/statuses/' + escape(id) + '/retweeted_by/ids.json';
//  this.post(url, params, null, callback);
//  return this;
//};


// Secret mail resources

Croudia.prototype.getSecretMails = function(params, callback) {
  var url = '/secret_mails.json';
  this.get(url, params, callback);
  return this;
};

Croudia.prototype.getSecretMailsSent = function(params, callback) {
  var url = '/secret_mails/sent.json';
  this.get(url, params, callback);
  return this;
};
Croudia.prototype.getSentSecretMails
  = Croudia.prototype.getSecretMailsSent;

Croudia.prototype.newSecretMail = function(id, text, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  var defaults = {
    text: text
  };
  if (typeof id === 'string')
    defaults.screen_name = id;
  else
    defaults.user_id = id;
  params = utils.merge(defaults, params);
  params = querystring.stringify(params);

  var url = '/secret_mails/new.json';
  this.post(url, params, null, callback);
  return this;
};
Croudia.prototype.updateSecretMail
  = Croudia.prototype.sendSecretMail
  = Croudia.prototype.newSecretMail;

Croudia.prototype.destroySecretMail = function(id, callback) {
  var url = '/secret_mails/destroy/' + escape(id) + '.json';
  this.post(url, null, null, callback);
  return this;
};
Croudia.prototype.deleteSecretMail
  = Croudia.prototype.destroySecretMail;

Croudia.prototype.showSecretMail = function(id, callback) {
  var url = '/secret_mails/show/' + escape(id) + '.json';
  this.get(url, null, callback);
  return this;
};
Croudia.prototype.getSecretMail
  = Croudia.prototype.showSecretMail;


// User resources

Croudia.prototype.showUser = function(id, callback) {
  var params = {};
  if (typeof id === 'string')
    params.screen_name = id;
  else
    params.user_id = id;

  var url = '/users/show.json';
  this.get(url, params, callback);
  return this;
};

Croudia.prototype.lookupUsers = function(id, callback) {
  //FIXME 良く分からない処理をしている引数idはカンマ区切りの文字列
  // Lookup will take a single id as well as multiple; why not just use it?
  var url = '/users/lookup.json',
      params = {}, ids = [], names = [];

  if (typeof id === 'string') {
    id = id.replace(/^\s+|\s+$/g, '');
    id = id.split(',');
  }

  // Wrap any stand-alone item in an array.
  id = [].concat(id);

  // Add numbers as userIds, strings as usernames.
  id.forEach(function(item) {
    if (+item)
      ids.push(item);
    else
      names.push(item);
  });

  params.user_id = ids.toString();
  params.screen_name = names.toString();

  this.get(url, params, callback);
  return this;
};
Croudia.prototype.showUsers
  = Croudia.prototype.lookupUsers;

//Croudia.prototype.searchUser = function(q, params, callback) {
//  //FIXME
//  if (typeof params === 'function') {
//    callback = params;
//    params = null;
//  }
//
//  var url = '/users/search.json';
//  params = utils.merge(params, {q:q});
//  this.get(url, params, callback);
//  return this;
//};
//Croudia.prototype.searchUsers
//  = Croudia.prototype.searchUser;

// FIXME: users/suggestions**

//Croudia.prototype.userProfileImage = function(id, params, callback) {
//  //FIXME
//  if (typeof params === 'function') {
//    callback = params;
//    params = null;
//  } else if (typeof params === 'string') {
//    params = { size: params };
//  }
//
//  var url = '/users/profile_image/' + escape(id) + '.json?' + querystring.stringify(params);
//
//  // Do our own request, so we can return the 302 location header
//  var request = this.oauth.get(this.options.rest_base + url,
//    this.options.access_token_key,
//    this.options.access_token_secret);
//  request.on('response', function(response) {
//    // return the location or an HTTP error
//    if (!response.headers.location) { 
//      callback(new Error('HTTP Error '
//      + response.statusCode + ': '
//      + http.STATUS_CODES[response.statusCode])) }
//    callback(null, response.headers.location);
//  });
//  request.end();
//
//  return this;
//};

// FIXME: statuses/friends, statuses/followers

// Trends resources

//Croudia.prototype.getTrends = function(callback) {
//  //FIXME
//  this.getTrendsWithId('1', null, callback);
//  return this;
//};

//Croudia.prototype.getCurrentTrends = function(params, callback) {
//  //FIXME
//  this.getTrendsWithId('1', params, callback);
//  return this;
//};

//Croudia.prototype.getTrendsWithId = function(woeid, params, callback) {
//  //FIXME
//  if (!woeid) woeid = '1';
//  var url = '/trends/' + woeid + '.json';
//  this.get(url, params, callback);
//  return this;
//};

//Croudia.prototype.getDailyTrends = function(params, callback) {
//  //FIXME
//  var url = '/trends/daily.json';
//  this.get(url, params, callback);
//  return this;
//};

//Croudia.prototype.getWeeklyTrends = function(params, callback) {
//  //FIXME
//  var url = '/trends/weekly.json';
//  this.get(url, params, callback);
//  return this;
//};

// Local Trends resources

// List resources

//Croudia.prototype.getLists = function(id, params, callback) {
//  //FIXME
//  if (typeof params === 'function') {
//    callback = params;
//    params = null;
//  }
//
//  var defaults = {key:'lists'};
//  if (typeof id === 'string')
//    defaults.screen_name = id;
//  else
//    defaults.user_id = id;
//  params = utils.merge(defaults, params);
//
//  var url = '/lists.json';
//  this._getUsingCursor(url, params, callback);
//  return this;
//};

//Croudia.prototype.getListMemberships = function(id, params, callback) {
//  //FIXME
//  if (typeof params === 'function') {
//    callback = params;
//    params = null;
//  }
//
//  var defaults = {key:'lists'};
//  if (typeof id === 'string')
//    defaults.screen_name = id;
//  else
//    defaults.user_id = id;
//  params = utils.merge(defaults, params);
//
//  var url = '/lists/memberships.json';
//  this._getUsingCursor(url, params, callback);
//  return this;
//};

//Croudia.prototype.getListSubscriptions = function(id, params, callback) {
//  //FIXME
//  if (typeof params === 'function') {
//    callback = params;
//    params = null;
//  }
//
//  var defaults = {key:'lists'};
//  if (typeof id === 'string')
//    defaults.screen_name = id;
//  else
//    defaults.user_id = id;
//  params = utils.merge(defaults, params);
//
//  var url = '/lists/subscriptions.json';
//  this._getUsingCursor(url, params, callback);
//  return this;
//};

// FIXME: Uses deprecated Croudia lists API
//Croudia.prototype.showList = function(screen_name, list_id, callback) {
//  //FIXME
//  var url = '/' + escape(screen_name) + '/lists/' + escape(list_id) + '.json';
//  this.get(url, null, callback);
//  return this;
//};

// FIXME: Uses deprecated Croudia lists API
//Croudia.prototype.getListTimeline = function(screen_name, list_id, params, callback) {
//  //FIXME
//  var url = '/' + escape(screen_name) + '/lists/' + escape(list_id) + '/statuses.json';
//  this.get(url, params, callback);
//  return this;
//};
//Croudia.prototype.showListStatuses
//  = Croudia.prototype.getListTimeline;

// FIXME: Uses deprecated Croudia lists API
//Croudia.prototype.createList = function(screen_name, list_name, params, callback) {
//  //FIXME
//  if (typeof params === 'function') {
//    callback = params;
//    params = null;
//  }
//
//  var url = '/' + escape(screen_name) + '/lists.json';
//  params = utils.merge(params, {name:list_name});
//  this.post(url, params, null, callback);
//  return this;
//};

// FIXME: Uses deprecated Croudia lists API
//Croudia.prototype.updateList = function(screen_name, list_id, params, callback) {
//  //FIXME
//  var url = '/' + escape(screen_name) + '/lists/' + escape(list_id) + '.json';
//  this.post(url, params, null, callback);
//  return this;
//};

// FIXME: Uses deprecated Croudia lists API
//Croudia.prototype.deleteList = function(screen_name, list_id, callback) {
//  //FIXME
//  var url = '/' + escape(screen_name) + '/lists/' + escape(list_id) + '.json?_method=DELETE';
//  this.post(url, null, callback);
//  return this;
//};
//Croudia.prototype.destroyList
//  = Croudia.prototype.deleteList;

// List Members resources

// FIXME: Uses deprecated Croudia lists API
//Croudia.prototype.getListMembers = function(screen_name, list_id, params, callback) {
//  //FIXME
//  if (typeof params === 'function') {
//    callback = params;
//    params = null;
//  }
//
//  var url = '/' + escape(screen_name) + '/' + escape(list_id) + '/members.json';
//  params = utils.merge(params, {key:'users'});
//  this._getUsingCursor(url, params, callback);
//  return this;
//};

// FIXME: the rest of list members

// List Subscribers resources

// FIXME: Uses deprecated Croudia lists API
//Croudia.prototype.getListSubscribers = function(screen_name, list_id, params, callback) {
//  //FIXME
//  if (typeof params === 'function') {
//    callback = params;
//    params = null;
//  }
//
//  var url = '/' + escape(screen_name) + '/' + escape(list_id) + '/subscribers.json';
//  params = utils.merge(params, {key:'users'});
//  this._getUsingCursor(url, params, callback);
//  return this;
//};


// Friendship resources

//Croudia.prototype.createFriendship = function(id, params, callback) {
//  //FIXME
//  if (typeof params === 'function') {
//    callback = params;
//    params = null;
//  }
//
//  var defaults = {
//    include_entities: 1
//  };
//  if (typeof id === 'string')
//    defaults.screen_name = id;
//  else
//    defaults.user_id = id;
//  params = utils.merge(defaults, params);
//
//  var url = '/friendships/create.json';
//  this.post(url, params, null, callback);
//  return this;
//};

//Croudia.prototype.destroyFriendship = function(id, callback) {
//  //FIXME
//  if (typeof id === 'function') {
//    callback = id;
//    id = null;
//  }
//
//  var params = {
//    include_entities: 1
//  };
//  if (typeof id === 'string')
//    params.screen_name = id;
//  else
//    params.user_id = id;
//
//  var url = '/friendships/destroy.json?_method=DELETE';
//  this.post(url, params, null, callback);
//  return this;
//};
//Croudia.prototype.deleteFriendship
//  = Croudia.prototype.destroyFriendship;

// Only exposing friendships/show instead of friendships/exist

//Croudia.prototype.showFriendship = function(source, target, callback) {
//  //FIXME
//  var params = {};
//
//  if (typeof source === 'string')
//    params.source_screen_name = source;
//  else
//    params.source_id = source;
//
//  if (typeof target === 'string')
//    params.target_screen_name = target;
//  else
//    params.target_id = target;
//
//  var url = '/friendships/show.json';
//  this.get(url, params, callback);
//  return this;
//};

//Croudia.prototype.incomingFriendship = function(callback) {
//  //FIXME
//  var url = '/friendships/incoming.json';
//  this._getUsingCursor(url, {key:'ids'}, callback);
//  return this;
//};
//Croudia.prototype.incomingFriendships
//  = Croudia.prototype.incomingFriendship;

//Croudia.prototype.outgoingFriendship = function(callback) {
//  //FIXME
//  var url = '/friendships/outgoing.json';
//  this._getUsingCursor(url, {key:'ids'}, callback);
//  return this;
//};
//Croudia.prototype.outgoingFriendships
//  = Croudia.prototype.outgoingFriendship;

//Croudia.prototype.lookupFriendship = function(id, callback) {
//  //FIXME
//  var url = '/friendships/lookup.json',
//      params = {}, ids = [], names = [];
//  
//  if (typeof id === 'string') {
//    id = id.replace(/^\s+|\s+$/g, '');
//    id = id.split(',');
//  }
//  
//  id = [].concat(id);
//  
//  id.forEach(function(item) {
//    if (parseInt(item, 10)) {
//      ids.push(item);
//    } else {
//      names.push(item);
//    }
//  });
//  
//  params.user_id = ids.toString();
//  params.screen_name = names.toString();
//  
//  this.get(url, params, callback);
//  return this;
//};

// Friends and Followers resources

//Croudia.prototype.getFriendsIds = function(id, callback) {
//  //FIXME
//  if (typeof id === 'function') {
//    callback = id;
//    id = null;
//  }
//
//  var params = { key: 'ids' };
//  if (typeof id === 'string')
//    params.screen_name = id;
//  else if (typeof id === 'number')
//    params.user_id = id;
//
//  var url = '/friends/ids.json';
//  this._getUsingCursor(url, params, callback);
//  return this;
//};

//Croudia.prototype.getFollowersIds = function(id, callback) {
//  //FIXME
//  if (typeof id === 'function') {
//    callback = id;
//    id = null;
//  }
//
//  var params = { key: 'ids' };
//  if (typeof id === 'string')
//    params.screen_name = id;
//  else if (typeof id === 'number')
//    params.user_id = id;
//
//  var url = '/followers/ids.json';
//  this._getUsingCursor(url, params, callback);
//  return this;
//};


// Various setting resources

Croudia.prototype.verifyCredentials = function(callback) {
  var url = '/account/verify_credentials.json';
  this.get(url, null, callback);
  return this;
};

//Croudia.prototype.rateLimitStatus = function(callback) {
//  //FIXME
//  var url = '/account/rate_limit_status.json';
//  this.get(url, null, callback);
//  return this;
//};

Croudia.prototype.updateProfileImage = function(image_path, callback) {
  var url = '/account/update_profile_image.json';
  var self = this;

  fs.readFile(image_path, function(err, data) {
    if (err) throw err;

    var boundary = +new Date();
    var post_data = [];

    var filePart = '--' + boundary + '\r\n';
    filePart += 'Content-Disposition: form-data; name="image"; filename="' + path.basename(image_path) + '"\r\n'
    filePart += 'Content-Type: ' + mime.lookup(image_path) + '\r\n\r\n'
    post_data.push(new Buffer(filePart, 'ascii'));
    post_data.push(new Buffer(data, 'utf8'));

    post_data.push(new Buffer('\r\n--' + boundary + '--', 'ascii'));


    var content = Buffer.concat(post_data);
    var contentType = 'multipart/form-data; boundary=' + boundary;

    self.post(url, content, contentType, callback);
  });

  return this;
};

Croudia.prototype.updateProfile = function(params, callback) {
  // params: name, url, location, description
  var url = '/account/update_profile.json';
  params = querystring.stringify(params);
  this.post(url, params, null, callback);
  return this;
};


// FIXME: Account resources section not complete

// Favorites resources

//Croudia.prototype.getFavorites = function(params, callback) {
//  //FIXME
//  var url = '/favorites.json';
//  this.get(url, params, callback);
//  return this;
//};

//Croudia.prototype.createFavorite = function(id, params, callback) {
//  //FIXME
//  var url = '/favorites/create/' + escape(id) + '.json';
//  this.post(url, params, null, callback);
//  return this;
//};
//Croudia.prototype.favoriteStatus
//  = Croudia.prototype.createFavorite;

//Croudia.prototype.destroyFavorite = function(id, params, callback) {
//  //FIXME
//  var url = '/favorites/destroy/' + escape(id) + '.json';
//  this.post(url, params, null, callback);
//  return this;
//};
//Croudia.prototype.deleteFavorite
//  = Croudia.prototype.destroyFavorite;

// Notification resources

// Block resources

//Croudia.prototype.createBlock = function(id, callback) {
//  //FIXME
//  var url = '/blocks/create.json';
//
//  var params = {};
//  if (typeof id === 'string')
//    params.screen_name = id;
//  else
//    params.user_id = id;
//
//  this.post(url, params, null, callback);
//  return this;
//};
//Croudia.prototype.blockUser
//  = Croudia.prototype.createBlock;

//Croudia.prototype.destroyBlock = function(id, callback) {
//  //FIXME
//  var url = '/blocks/destroy.json';
//
//  var params = {};
//  if (typeof id === 'string')
//    params.screen_name = id;
//  else
//    params.user_id = id;
//
//  this.post(url, params, null, callback);
//  return this;
//};
//Croudia.prototype.unblockUser
//  = Croudia.prototype.destroyBlock;

//Croudia.prototype.blockExists = function(id, callback) {
//  //FIXME
//  var url = '/blocks/exists.json';
//
//  var params = {};
//  if (typeof id === 'string')
//    params.screen_name = id;
//  else
//    params.user_id = id;
//
//  this.get(url, params, callback);
//  return this;
//};
//Croudia.prototype.isBlocked
//  = Croudia.prototype.blockExists;

// FIXME: blocking section not complete (blocks/blocking + blocks/blocking/ids)

// Spam Reporting resources

//Croudia.prototype.reportSpam = function(id, callback) {
//  //FIXME
//  var url = '/report_spam.json';
//
//  var params = {};
//  if (typeof id === 'string')
//    params.screen_name = id;
//  else
//    params.user_id = id;
//
//  this.post(url, params, null, callback);
//  return this;
//};

// Saved Searches resources

//Croudia.prototype.savedSearches = function(callback) {
//  //FIXME
//  var url = '/saved_searches.json';
//  this.get(url, null, callback);
//  return this;
//};

//Croudia.prototype.showSavedSearch = function(id, callback) {
//  //FIXME
//  var url = '/saved_searches/' + escape(id) + '.json';
//  this.get(url, null, callback);
//  return this;
//};

//Croudia.prototype.createSavedSearch = function(query, callback) {
//  //FIXME
//  var url = '/saved_searches/create.json';
//  this.post(url, {query: query}, null, callback);
//  return this;
//};
//Croudia.prototype.newSavedSearch =
//  Croudia.prototype.createSavedSearch;

//Croudia.prototype.destroySavedSearch = function(id, callback) {
//  //FIXME
//  var url = '/saved_searches/destroy/' + escape(id) + '.json?_method=DELETE';
//  this.post(url, null, null, callback);
//  return this;
//};
//Croudia.prototype.deleteSavedSearch =
//  Croudia.prototype.destroySavedSearch;

// OAuth resources

// Geo resources

//Croudia.prototype.geoSearch = function(params, callback) {
//  //FIXME
//  var url = '/geo/search.json';
//  this.get(url, params, callback);
//  return this;
//};

//Croudia.prototype.geoSimilarPlaces = function(lat, lng, name, params, callback) {
//  //FIXME
//  if (typeof params === 'function') {
//    callback = params;
//    params = {};
//  } else if (typeof params !== 'object') {
//    params = {};
//  }
//
//  if (typeof lat !== 'number' || typeof lng !== 'number' || !name) {
//    callback(new Error('FAIL: You must specify latitude, longitude (as numbers) and name.'));
//  }
//
//  var url = '/geo/similar_places.json';
//  params.lat = lat;
//  params.long = lng;
//  params.name = name;
//  this.get(url, params, callback);
//  return this;
//};

//Croudia.prototype.geoReverseGeocode = function(lat, lng, params, callback) {
//  //FIXME
//  if (typeof params === 'function') {
//    callback = params;
//    params = {};
//  } else if (typeof params !== 'object') {
//    params = {};
//  }
//
//  if (typeof lat !== 'number' || typeof lng !== 'number') {
//    callback(new Error('FAIL: You must specify latitude and longitude as numbers.'));
//  }
//
//  var url = '/geo/reverse_geocode.json';
//  params.lat = lat;
//  params.long = lng;
//  this.get(url, params, callback);
//  return this;
//};

//Croudia.prototype.geoGetPlace = function(place_id, callback) {
//  //FIXME
//  var url = '/geo/id/' + escape(place_id) + '.json';
//  this.get(url, callback);
//  return this;
//};

// Legal resources

// Help resources

// Streamed Tweets resources

// Search resources

// #newtwitter
//Croudia.prototype.getRelatedResults = function(id, params, callback) {
//  //FIXME
//  var url = '/related_results/show/' + escape(id) + '.json';
//  this.get(url, params, callback);
//  return this;
//};

/*
 * INTERNAL UTILITY FUNCTIONS
 */

//Croudia.prototype._getUsingCursor = function(url, params, callback) {
//  //FIXME
//  var self = this,
//    params = params || {},
//    key = params.key || null,
//    result = [];
//
//  // if we don't have a key to fetch, we're screwed
//  if (!key)
//    callback(new Error('FAIL: Results key must be provided to _getUsingCursor().'));
//  delete params.key;
//
//  // kick off the first request, using cursor -1
//  params = utils.merge(params, {cursor:-1});
//  this.get(url, params, fetch);
//
//  function fetch(err, data) {
//    if (err) {
//      return callback(err);
//    }
//
//    // FIXME: what if data[key] is not a list?
//    if (data[key]) result = result.concat(data[key]);
//
//    if (data.next_cursor_str === '0') {
//      callback(null, result);
//    } else {
//      params.cursor = data.next_cursor_str;
//      self.get(url, params, fetch);
//    }
//  }
//
//  return this;
//};


/*
 * monkey patch for oauth@0.9.10
 */
oauth.OAuth2.prototype.post = function(url, access_token, post_body, post_content_type, callback) {
  if (this._useAuthorizationHeaderForGET) {
    var headers = {'Authorization': this.buildAuthHeader(access_token)};
    access_token = null;
  }
  else {
    headers= {};
  }

//  if (typeof post_body === 'object')
//    post_body = querystring.stringify(post_body);

  if (post_content_type)
    headers['Content-Type'] = post_content_type;

  this._request("POST", url, headers, post_body, access_token, callback);
};

