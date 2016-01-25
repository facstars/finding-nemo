var Hapi = require('hapi');
var Path = require('path');
var Inert = require('inert');
var RestaurantSpecific = require('./restSpecific.js');
var userSignup = require('./userSignup.js');
var userLogin = require('./userLogin.js');


exports.init = function(port,next){
  var server = new Hapi.Server({
  });

  server.connection({port: port});

  server.state('data', {
    ttl: null,
    isSecure: false,
    isHttpOnly: true,
    encoding: 'none',
    clearInvalid: false, // remove invalid cookies
    strictHeader: true // don't allow violations of RFC 6265
  });

  server.register([Inert, RestaurantSpecific, userSignup, userLogin], function(err){
    if (err) {
      return next(err);
    }
  });

  server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
          directory: {
              path: 'public',
              //TODO: remove listing:true later!!!
              listing: true,
              redirectToSlash: true,
              index: true
          }
      }
  });

  server.start(function (err) {
    console.log('Server running at:', server.info.uri);
    return next(err,server);
  });

module.exports = server;
};
