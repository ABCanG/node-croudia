var VERSION = '0.0.1',
  http = require('http'),
  querystring = require('querystring'),
  oauth = require('oauth'),
  fs = require('fs'),
  path = require('path'),
  mime = require('mime'),
  utils = require('./utils');
  keys = require('./keys');

/**
 * Croudia class
 * @class
 */
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

    tokenChangeListener: null
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
module.exports = Croudia;

/**
 * Version
 * @function
 * @type String
 */
Croudia.VERSION = VERSION;

/**
 * GET
 * @function
 * @param {String} url Request url
 * @param {Object} params Parameters
 * @param {Function} callback Callback  function(err, json) {}
 * @returns {Croudia} this instance
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


/**
 * Post
 * @function
 * @param {String} url Request url
 * @param {Object} content Parameters
 * @param {String} content_type Content type
 * @param {Function} callback Callback  function(err, json) {}
 * @returns {Croudia} this instance
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


/**
 * Authentication resources
 */

/**
 * Get authorize url
 * @function
 * @returns {String} Authorize url
 */
Croudia.prototype.getAuthorizeUrl = function() {
  return this.oauth.getAuthorizeUrl({response_type: 'code'});
};

/**
 * Login by authorized url
 * @function
 * @param {String} responseUrl Response url
 * @param {Function} callback Callback  function() {}
 */
Croudia.prototype.login = function(responseUrl, callback) {
  var query = require('url').parse(responseUrl, true).query;

  this._getOAuthAccessToken(
    query.code,
    'authorization_code',
    callback);
};

/**
 * Refresh access token
 * @function
 * @param {Function} callback Callback  function() {}
 */
Croudia.prototype.refresh = function(callback) {
  this._getOAuthAccessToken(
    this.options.refresh_token,
    'refresh_token',
    callback);
};

/**
 * Set token change listener
 * @function
 * @param {Function} callback Callback  function(tokens) {}
 */
Croudia.prototype.setTokenChangeListener = function(listener) {
  this.options.tokenChangeListener = listener;
};


/**
 * Timeline resources
 */

/**
 * Get public timeline
 * @function
 * @param {Object} params Parameters<br/>
 *  Option<ul><li>trim_user</li><li>include_entities</li></ul>
 *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
 * @param {Function} callback Callback  function(err, statusList) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.getPublicTimeline = function(params, callback) {
  var url = '/statuses/public_timeline.json';
  this.get(url, params, callback);
  return this;
};

/**
 * Get home timeline
 * @function
 * @param {Object} params Parameters<br/>
 *  Option<ul><li>trim_user</li><li>include_entities</li></ul>
 *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
 * @param {Function} callback Callback  function(err, statusList) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.getHomeTimeline = function(params, callback) {
  var url = '/statuses/home_timeline.json';
  this.get(url, params, callback);
  return this;
};

/**
 * Get user timeline
 * @function
 * @param {?} id user_id (Number) or screen_name (String)
 * @param {Object} params Parameters<br/>
 *  Require either<ul><li>user_id</li><li>screen_name</li></ul>
 *  Option<ul><li>trim_user</li><li>include_entities</li></ul>
 *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
 * @param {Function} callback Callback  function(err, statusList) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.getUserTimeline = function(id, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  params = params || {};

  if (typeof id === 'string')
    params.screen_name = id;
  else if (typeof id === 'number')
    params.user_id = id;

  var url = '/statuses/user_timeline.json';
  this.get(url, params, callback);
  return this;
};

/**
 * Get mentions
 * @function
 * @param {Object} params Parameters<br/>
 *  Option<ul><li>trim_user</li><li>include_entities</li></ul>
 *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
 * @param {Function} callback Callback  function(err, statusList) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.getMentions = function(params, callback) {
  var url = '/statuses/mentions.json';
  this.get(url, params, callback);
  return this;
};


/**
 * Voice resources
 */

/**
 * Update status or replay
 * @function
 * @param {String} text Message
 * @param {Object} params Parameters<br/>
 *  Option<ul><li>in_reply_to_status_id</li><li>in_reply_with_quote</li><li>trim_user</li><li>include_entities</li></ul>
 * @param {Function} callback Callback  function(err, status) {}
 * @returns {Croudia} this instance
 */
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

/**
 * Update status or replay with media
 * @function
 * @param {String} text Message
 * @param {String} media_path Image(PNG, JPG, GIF) file path
 * @param {Object} params Parameters<br/>
 *  Option<ul><li>in_reply_to_status_id</li><li>in_reply_with_quote</li><li>trim_user</li><li>include_entities</li></ul>
 * @param {Function} callback Callback  function(err, status) {}
 * @returns {Croudia} this instance
 */
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

/**
 * Destroy status
 * @function
 * @param {Number} id Status id
 * @param {Function} callback Callback  function(err, status) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.destroyStatus = function(id, callback) {
  var url = '/statuses/destroy/' + escape(id) + '.json';
  this.post(url, null, null, callback);
  return this;
};
Croudia.prototype.deleteStatus
  = Croudia.prototype.destroyStatus;

/**
 * Show status
 * @function
 * @param {Number} id Status id
 * @param {Object} params Parameters<br/>
 *  Option<ul><li>trim_user</li><li>include_entities</li></ul>
 * @param {Function} callback Callback  function(err, status) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.showStatus = function(id, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  var url = '/statuses/show/' + escape(id) + '.json';
  this.get(url, params, callback);
  return this;
};
Croudia.prototype.getStatus
  = Croudia.prototype.showStatus;


/**
 * Secret mail resources
 */

/**
 * Get secret mails
 * @function
 * @param {Object} params Parameters<br/>
 *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
 * @param {Function} callback Callback  function(err, secretmailList) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.getSecretMails = function(params, callback) {
  var url = '/secret_mails.json';
  this.get(url, params, callback);
  return this;
};

/**
 * Get secret mails send
 * @function
 * @param {Object} params Parameters<br/>
 *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
 * @param {Function} callback Callback  function(err, secretmailList) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.getSecretMailsSent = function(params, callback) {
  var url = '/secret_mails/sent.json';
  this.get(url, params, callback);
  return this;
};
Croudia.prototype.getSentSecretMails
  = Croudia.prototype.getSecretMailsSent;

/**
 * New Secret mail
 * @function
 * @param {?} id user_id (Number) or screen_name (String)
 * @param {String} text Message
 * @param {Function} callback Callback  function(err, secretmail) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.newSecretMail = function(id, text, callback) {
  var params = {
    text: text
  };
  if (typeof id === 'string')
    params.screen_name = id;
  else if (typeof id === 'number')
    params.user_id = id;
  params = querystring.stringify(params);

  var url = '/secret_mails/new.json';
  this.post(url, params, null, callback);
  return this;
};
Croudia.prototype.updateSecretMail
  = Croudia.prototype.sendSecretMail
  = Croudia.prototype.newSecretMail;

/**
 * Destroy secret mail
 * @function
 * @param {Number} id Secret mail id
 * @param {Function} callback Callback  function(err, secretmail) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.destroySecretMail = function(id, callback) {
  var url = '/secret_mails/destroy/' + escape(id) + '.json';
  this.post(url, null, null, callback);
  return this;
};
Croudia.prototype.deleteSecretMail
  = Croudia.prototype.destroySecretMail;

/**
 * Show secret mail
 * @function
 * @param {Number} id Secret mail id
 * @param {Function} callback Callback  function(err, secretmail) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.showSecretMail = function(id, callback) {
  var url = '/secret_mails/show/' + escape(id) + '.json';
  this.get(url, null, callback);
  return this;
};
Croudia.prototype.getSecretMail
  = Croudia.prototype.showSecretMail;


/**
 * User resources
 */

/**
 * Show user
 * @function
 * @param {?} id user_id (Number) or screen_name (String)
 * @param {Function} callback Callback  function(err, user) {}
 * @returns {Croudia} this instance
 */
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

/**
 * Lookup users
 * @function
 * @param {Array} id user_id (Number) or screen_name (String)
 * @param {Function} callback Callback  function(err, userList) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.lookupUsers = function(id, callback) {
  var url = '/users/lookup.json',
      params = {}, ids = [], names = [];

  // Wrap any stand-alone item in an array.
  id = [].concat(id);

  // Add numbers as userIds, strings as usernames.
  id.forEach(function(item) {
    if (parseInt(item, 10))
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


/**
 * Various setting resources
 */

/**
 * Verify credentials
 * @function
 * @param {Function} callback Callback  function(err, user) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.verifyCredentials = function(callback) {
  var url = '/account/verify_credentials.json';
  this.get(url, null, callback);
  return this;
};

/**
 * Update profile image
 * @function
 * @param {String} image_path Image(PNG, JPG, GIF) file path
 * @param {Function} callback Callback  function(err, user) {}
 * @returns {Croudia} this instance
 */
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

/**
 * Update profile
 * @function
 * @param {Object} params Parameters<br/>
 *  Option<ul><li>name</li><li>url</li><li>location</li><li>description</li></ul>
 * @param {Function} callback Callback  function(err, user) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.updateProfile = function(params, callback) {
  // params: name, url, location, description
  var url = '/account/update_profile.json';
  params = querystring.stringify(params);
  this.post(url, params, null, callback);
  return this;
};


/**
 * Friendship resources
 */

/**
 * Create friendship
 * @function
 * @param {?} id user_id (Number) or screen_name (String)
 * @param {Function} callback Callback  function(err, user) {}
 * @returns {Croudia} this instance
 */
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

/**
 * Destroy friendship
 * @function
 * @param {?} id user_id (Number) or screen_name (String)
 * @param {Function} callback Callback  function(err, user) {}
 * @returns {Croudia} this instance
 */
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

/**
 * Show friendship
 * @function
 * @param {?} source source user_id (Number) or screen_name (String)
 * @param {?} target target user_id (Number) or screen_name (String)
 * @param {Function} callback Callback  function(err, obj) {}
 * @returns {Croudia} this instance
 */
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

/**
 * Lookup friendship
 * @function
 * @param {?} id user_id (Number) or screen_name (String)
 * @param {Function} callback Callback  function(err, json) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.lookupFriendship = function(id, callback) {
  var url = '/friendships/lookup.json',
      params = {}, ids = [], names = [];

  // Wrap any stand-alone item in an array.
  id = [].concat(id);

  // Add numbers as userIds, strings as usernames.
  id.forEach(function(item) {
    if (parseInt(item, 10))
      ids.push(item);
    else
      names.push(item);
  });

  params.user_id = ids.toString();
  params.screen_name = names.toString();

  this.get(url, params, callback);
  return this;
};

/**
 * Get friends ids
 * @function
 * @param {?} id user_id (Number) or screen_name (String)
 * @param {Function} callback Callback  function(err, idList) {}
 * @returns {Croudia} this instance
 */
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

/**
 * Get followers ids
 * @function
 * @param {?} id user_id (Number) or screen_name (String)
 * @param {Function} callback Callback  function(err, idList) {}
 * @returns {Croudia} this instance
 */
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

/**
 * Get friends list
 * @function
 * @param {?} id user_id (Number) or screen_name (String)
 * @param {Object} params Parameters<br/>
 *  Option<ul><li>trim_user</li></ul>
 * @param {Function} callback Callback  function(err, userList) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.getFriendsList = function(id, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  var defaults = {key: 'users'};
  params = utils.merge(defaults, params);
  if (typeof id === 'string')
    params.screen_name = id;
  else if (typeof id === 'number')
    params.user_id = id;

  var url = '/friends/list.json';
  this._getUsingCursor(url, params, callback);
  return this;
};

/**
 * Get followers list
 * @function
 * @param {?} id user_id (Number) or screen_name (String)
 * @param {Object} params Parameters<br/>
 *  Option<ul><li>trim_user</li></ul>
 * @param {Function} callback Callback  function(err, userList) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.getFollowersList = function(id, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  var defaults = {key: 'users'};
  params = utils.merge(defaults, params);
  if (typeof id === 'string')
    params.screen_name = id;
  else if (typeof id === 'number')
    params.user_id = id;

  var url = '/followers/list.json';
  this._getUsingCursor(url, params, callback);
  return this;
};


/**
 * Favorites resources
 */

/**
 * Get favorites
 * @function
 * @param {Object} params Parameters<br/>
 *  Option<ul><li>include_entities</li></ul>
 *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
 * @param {Function} callback Callback  function(err, statusList) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.getFavorites = function(params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  var url = '/favorites.json';
  this.get(url, params, callback);
  return this;
};

/**
 * Create favorite
 * @function
 * @param {Number} id Favorite id
 * @param {Object} params Parameters<br/>
 *  Option<ul><li>include_entities</li></ul>
 * @param {Function} callback Callback  function(err, status) {}
 * @returns {Croudia} this instance
 */
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

/**
 * Destroy favorite
 * @function
 * @param {Number} id Favorite id
 * @param {Object} params Parameters<br/>
 *  Option<ul><li>include_entities</li></ul>
 * @param {Function} callback Callback  function(err, status) {}
 * @returns {Croudia} this instance
 */
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


/**
 * spread resources
 */

/**
 * Spread status
 * @function
 * @param {Number} id Status id
 * @param {Object} params Parameters<br/>
 *  Option<ul><li>trim_user</li><li>include_entities</li></ul>
 * @param {Function} callback Callback  function(err, status) {}
 * @returns {Croudia} this instance
 */
Croudia.prototype.spreadStatus = function(id, params, callback) {
  var url = 'statuses/spread/' + escape(id) + '.json';
  this.post(url, params, null, callback);
  return this;
};


/**
 * Search resources
 */

/**
 * Search voices
 * @function
 * @param {String} query Search query
 * @param {Object} params Parameters<br/>
 *  Option<ul><li>trim_user</li><li>include_entities</li></ul>
 *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
 * @param {Function} callback Callback  function(err, searchMetaDataAndStatusList) {}
 * @returns {Croudia} this instance
 */
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

/**
 * Search users
 * @function
 * @param {Object} params Parameters<br/>
 *  Option<ul><li>trim_user</li></ul>
 *  Pager<ul><li>page</li><li>count</li></ul>
 * @param {Function} callback Callback  function(err, userList) {}
 * @returns {Croudia} this instance
 */
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


/**
 * Internal utility functions
 */

/**
 * @function
 * @private
 * @param {String} token Access token or code
 * @param {String} grantType Grant type
 * @param {Function} callback Callback  function(err, json) {}
 */
Croudia.prototype._getOAuthAccessToken = function(token, grantType, callback) {
  var self = this;

  this.oauth.getOAuthAccessToken(
    token,
    {'grant_type': grantType},
    function(err, access_token, refresh_token, results) {
      if (err) {
        console.error(err);
        return;
      }

      self.options.access_token = access_token;
      self.options.refresh_token = refresh_token;

      callback();

      if (typeof self.options.tokenChangeListener === 'function') {
        self.options.tokenChangeListener({
          access_token: self.options.access_token,
          refresh_token: self.options.refresh_token
        });
      }
    });
};

/**
 * @function
 * @private
 * @param {Object} content Parameters
 * @param {Function} callback Callback  function(err, json) {}
 * @returns {Croudia} this instance
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


/**
 * Monkey patch for oauth@0.9.10
 * @function
 * @param {String} url Request url
 * @param {String} access_token Access token
 * @param {Object} post_body Body
 * @param {String} post_content_type Content type
 * @param {Function} callback Callback  function(err, json) {}
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

