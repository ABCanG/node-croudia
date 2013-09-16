var VERSION = '0.0.1',
  http = require('http'),
  querystring = require('querystring'),
  oauth = require('oauth'),
  fs = require('fs'),
  path = require('path'),
  mime = require('mime'),
  utils = require('./utils');
  keys = require('./keys');

function Croudia(options) {
  if (!(this instanceof Croudia)) return new Croudia(options);

  var defaults = {
    consumer_key: null,
    consumer_secret: null,
    access_token: null,
    refresh_token: null,

    headers: {
      'Accept': '*/*',
      'Connection': 'close',
      'User-Agent': 'node-croudia/' + VERSION
    },
  };
  this.options = utils.merge(defaults, options, keys.urls);

  this.oauth = new oauth.OAuth2(
    this.options.consumer_key,
    this.options.consumer_secret,
    this.options.rest_base,
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
    url = url + '?' + querystring.stringify(params);

  var self = this;

  this.oauth.get(url, this.options.access_token,
  function(error, data, response) {
    if ( error && error.statusCode === 401) { //Unauthorized
      self.refresh(function() { //refresh access_token
        self.get(url, params, callback);
      });
    } else if (error && error.statusCode) {
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
    if ( error && error.statusCode === 401) { //Unauthorized
      self.refresh(function() { //refresh access_token
        self.get(url, params, callback);
      });
    } else if ( error && error.statusCode ) {
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


// Authentication resources

Croudia.prototype.getAuthorizeUrl = function() {
  return this.oauth.getAuthorizeUrl({response_type: 'code'});
};

Croudia.prototype.login = function(responseUrl, callback) {
  var self = this,
    query = require('url').parse(responseUrl, true).query;

  this.oauth.getOAuthAccessToken(
    query.code,
    {'grant_type': 'authorization_code'},
    function(err, access_token, refresh_token, results) {
      if (err) {
        console.log(err);
        return;
      }

      self.options.access_token = access_token;
      self.options.refresh_token = refresh_token;

      callback();
    });
};

Croudia.prototype.refresh = function(callback) {
  var self = this;

  this.oauth.getOAuthAccessToken(
    this.options.refresh_token,
    {'grant_type': 'refresh_token'},
    function(err, access_token, refresh_token, results) {
      if (err) {
        console.log(err);
        return;
      }

      self.options.access_token = access_token;
      self.options.refresh_token = refresh_token;

      callback();
    });
};


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
  else if (typeof id === 'number')
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
  else if (typeof id === 'number')
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


// Various setting resources

Croudia.prototype.verifyCredentials = function(callback) {
  var url = '/account/verify_credentials.json';
  this.get(url, null, callback);
  return this;
};

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


// Friendship resources

Croudia.prototype.createFriendship = function(id, callback) {
  var params = {};
  if (typeof id === 'string')
    params.screen_name = id;
  else if (typeof id === 'number')
    params.user_id = id;

  params = querystring.stringify(params);

  var url = '/friendships/create.json';
  this.post(url, params, null, callback);
  return this;
};

Croudia.prototype.destroyFriendship = function(id, callback) {
  var params = {};
  if (typeof id === 'string')
    params.screen_name = id;
  else if (typeof id === 'number')
    params.user_id = id;

  params = querystring.stringify(params);

  var url = '/friendships/destroy.json';
  this.post(url, params, null, callback);
  return this;
};
Croudia.prototype.deleteFriendship
  = Croudia.prototype.destroyFriendship;

Croudia.prototype.showFriendship = function(source, target, callback) {
  var params = {};

  if (typeof source === 'string')
    params.source_screen_name = source;
  else if (typeof id === 'number')
    params.source_id = source;

  if (typeof target === 'string')
    params.target_screen_name = target;
  else if (typeof id === 'number')
    params.target_id = target;

  var url = '/friendships/show.json';
  this.get(url, params, callback);
  return this;
};

Croudia.prototype.lookupFriendship = function(id, callback) {
  //FIXME よくわからない処理をしている
  var url = '/friendships/lookup.json',
      params = {}, ids = [], names = [];

  if (typeof id === 'string') {
    id = id.replace(/^\s+|\s+$/g, '');
    id = id.split(',');
  }

  id = [].concat(id);

  id.forEach(function(item) {
    if (parseInt(item, 10)) {
      ids.push(item);
    } else {
      names.push(item);
    }
  });

  params.user_id = ids.toString();
  params.screen_name = names.toString();

  this.get(url, params, callback);
  return this;
};

Croudia.prototype.getFriendsIds = function(id, callback) {
  var params = { key: 'ids' };
  if (typeof id === 'string')
    params.screen_name = id;
  else if (typeof id === 'number')
    params.user_id = id;

  var url = '/friends/ids.json';
  this._getUsingCursor(url, params, callback);
  return this;
};

Croudia.prototype.getFollowersIds = function(id, callback) {
  var params = { key: 'ids' };
  if (typeof id === 'string')
    params.screen_name = id;
  else if (typeof id === 'number')
    params.user_id = id;

  var url = '/followers/ids.json';
  this._getUsingCursor(url, params, callback);
  return this;
};

Croudia.prototype.getFriendsList = function(id, callback) {
  var params = { key: 'users' };
  if (typeof id === 'string')
    params.screen_name = id;
  else if (typeof id === 'number')
    params.user_id = id;

  var url = '/friends/list.json';
  this._getUsingCursor(url, params, callback);
  return this;
};

Croudia.prototype.getFollowersList = function(id, callback) {
  var params = { key: 'users' };
  if (typeof id === 'string')
    params.screen_name = id;
  else if (typeof id === 'number')
    params.user_id = id;

  var url = '/followers/list.json';
  this._getUsingCursor(url, params, callback);
  return this;
};


// Favorites resources

Croudia.prototype.getFavorites = function(params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  var url = '/favorites.json';
  this.get(url, params, callback);
  return this;
};

Croudia.prototype.createFavorite = function(id, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  var url = '/favorites/create/' + escape(id) + '.json';
  this.post(url, params, null, callback);
  return this;
};
Croudia.prototype.favoriteStatus
  = Croudia.prototype.createFavorite;

Croudia.prototype.destroyFavorite = function(id, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  var url = '/favorites/destroy/' + escape(id) + '.json';
  this.post(url, params, null, callback);
  return this;
};
Croudia.prototype.deleteFavorite
  = Croudia.prototype.destroyFavorite;


// spread resources

Croudia.prototype.spreadStatus = function(id, params, callback) {
  var url = 'statuses/spread/' + escape(id) + '.json';
  this.post(url, params, null, callback);
  return this;
};


// Search resources

Croudia.prototype.searchVoices = function(query, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  var url = '/search/voices.json',
    params = params || {};
  params.q = query;
  this.get(url, params, callback);
  return this;
};

Croudia.prototype.searchUsers = function(query, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  var url = '/users/search.json',
    params = params || {};
  params.q = query;
  this.get(url, params, callback);
  return this;
};


/*
 * INTERNAL UTILITY FUNCTIONS
 */
Croudia.prototype._getUsingCursor = function(url, params, callback) {
  var self = this,
    params = params || {},
    key = params.key || null,
    result = [];

  // if we don't have a key to fetch, we're screwed
  if (!key)
    callback(new Error('FAIL: Results key must be provided to _getUsingCursor().'));
  delete params.key;

  // kick off the first request, using cursor -1
  params = utils.merge(params, {cursor: -1});
  this.get(url, params, fetch);

  function fetch(err, data) {
    if (err) {
      return callback(err);
    }

    if (data[key] && Array.isArray(data[key])) result = result.concat(data[key]);

    if (data.next_cursor_str === null || data.next_cursor_str === '0') {
      callback(null, result);
    } else {
      params.cursor = data.next_cursor_str;
      self.get(url, params, fetch);
    }
  }

  return this;
};


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

  if (post_content_type)
    headers['Content-Type'] = post_content_type;
  else

  this._request("POST", url, headers, post_body, access_token, callback);
};

