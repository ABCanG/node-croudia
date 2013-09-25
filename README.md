Croudia client API for node.js
==============================

[node-croudia](https://github.com/yuhki50/node-croudia) aims to provide a complete, asynchronous client library for the Croudia API, including the REST and search endpoints. It was inspired by, and uses some code from, [@AvianFlu](https://github.com/AvianFlu)'s [ntwitter](https://github.com/AvianFlu/ntwitter).


## Installation

You can install node-croudia and its dependencies with npm: `npm install croudia`.


## Getting started

The most significant API change involves error handling in callbacks. Callbacks now receive the error as a separate parameter, rather than as part of the data. This is consistent with node's standard library. Callbacks should now look something like this:

``` javascript
function (err, result) {
  if (err) return callback(err);

  // Do something with 'result' here
}
```

Where `callback` is the parent function's callback.  (Or any other function you want to call on error.)


### Setup API

The keys listed below can be obtained from [https://developer.croudia.com](https://developer.croudia.com) after [setting up a new App](https://developer.croudia.com/apps).

``` javascript
var Croudia = require('croudia');

var crou = new Croudia({
  consumer_key: 'consumer key here',
  consumer_secret: 'consumer secret here',
});
```

### Authentication API

``` javascript
var authorizeUrl = crou.getAuthorizeUrl();
console.log(authorizeUrl);

// open browser and input authorizeUrl

var responsedUrl = 'responsed url here';

crou.login(responsedUrl, function(err) {
  if (err) {
    console.log(error);
    return;
  }

  // Authentication success
});
```


### REST API

Interaction with other parts of Croudia is accomplished through their RESTful API.
The best documentation for this exists at [developer.croudia.com](https://developer.croudia.com).  Convenience methods exist
for many of the available methods, but some may be more up-to-date than others.
If your Croudia interaction is very important, double-check the parameters in the code with 
Croudia's current documentation.

``` javascript
crou.updateStatus('Test voice from node-croudia/' + crou.VERSION,
  function (err, data) {
    if (err) {
      console.log(err);
    }
    console.log(data);
  }
);
```

#### Method list

Please refer to the [doc](https://github.com/yuhki50/node-croudia/tree/master/doc) directory for more information on each method.

``` javascript
/** Basic api access */
Croudia#get(url, params, callback);
Croudia#post(url, content, content_type, callback);

/** Authentication resources */
Croudia#getAuthorizeUrl();
Croudia#login(responseUrl, callback);
Croudia#refresh(callback);
Croudia#setTokenChangeListener(listener);

/** Timeline resources */
Croudia#getPublicTimeline(params, callback);
Croudia#getHomeTimeline(params, callback);
Croudia#getUserTimeline(id, params, callback);
Croudia#getMentions(params, callback);

/** Voice resources */
Croudia#updateStatus(text, params, callback);
Croudia#updateWithMediaStatus(text, media_path, params, callback);
Croudia#destroyStatus(id, callback);
Croudia#deleteStatus(id, callback);  // alias destroyStatus
Croudia#showStatus(id, params, callback);
Croudia#getStatus(id, params, callback);  // alias showStatus

/** Secret mail resources */
Croudia#getSecretMails(params, callback);
Croudia#getSecretMailsSent(params, callback);
Croudia#getSentSecretMails(params, callback);  // alias getSecretMailsSent
Croudia#newSecretMail(id, text, callback);
Croudia#updateSecretMail(id, text, callback);  // alias newSecretMail
Croudia.prototype.sendSecretMail(id, text, callback);  // alias newSecretMail
Croudia#destroySecretMail(id, callback);
Croudia#deleteSecretMail(id, callback);  // alias destroySecretMail
Croudia#showSecretMail(id, callback);
Croudia#getSecretMail(id, callback);  // alias showSecretMail

/** User resources */
Croudia#showUser(id, callback);
Croudia#lookupUsers(id, callback);
Croudia#showUsers(id, callback);  // alias lookupUsers

/** Various setting resources */
Croudia#verifyCredentials(callback);
Croudia#updateProfileImage(image_path, callback);
Croudia#updateProfile(params, callback);

/** Friendship resources */
Croudia#createFriendship(id, callback);
Croudia#destroyFriendship(id, callback);
Croudia#deleteFriendship(id, callback);  // alias destroyFriendship
Croudia#showFriendship(source, target, callback);
Croudia#lookupFriendship(id, callback);
Croudia#getFriendsIds(id, callback);
Croudia#getFollowersIds(id, callback);
Croudia#getFriendsList(id, params, callback);
Croudia#getFollowersList(id, params, callback);

/** Favorites resources */
Croudia#getFavorites(params, callback);
Croudia#createFavorite(id, params, callback);
Croudia#favoriteStatus(id, params, callback);  // alias createFavorite
Croudia#destroyFavorite(id, params, callback);
Croudia#deleteFavorite(id, params, callback);  // alias deleteFavorite

/** Spread resources */
Croudia#spreadStatus(id, params, callback);

/** Search resources */
Croudia#searchVoices(query, params, callback);
Croudia#searchUsers(query, params, callback);
```


## TODO

- Unit test
- Fix all the things! on the GitHub [issues list](https://github.com/yuhki50/node-croudia/issues)
