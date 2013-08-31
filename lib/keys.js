module.exports = {
  urls: {
    request_token_url: 'https://api.twitter.com/oauth/request_token',
    access_token_url: 'https://api.twitter.com/oauth/access_token',
    //authenticate_url: 'https://api.twitter.com/oauth/authenticate', //TODO 削除予定
    authorize_url: 'https://api.twitter.com/oauth/authorize', //TODO 削除予定
    rest_base: 'https://api.croudia.com/',
    search_base: 'http://search.twitter.com',
    stream_base: 'https://stream.twitter.com/1.1',
    user_stream_base: 'https://userstream.twitter.com/1.1',
    site_stream_base: 'https://sitestream.twitter.com/1.1',

    authorize_path: 'oauth/authorize',
    access_token_path: 'oauth/token'
  }
};

