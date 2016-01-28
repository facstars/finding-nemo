var Hapi = require('hapi');
var Path = require('path');
var Inert = require('inert');
var RestaurantSpecific = require('./restSpecific.js');
var CheckIn = require('./checkIn.js');
var userSignup = require('./userSignup.js');
var userLogin = require('./userLogin.js');
var Sms = require('./sms.js');




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

//REMEMBER TO ADD  HERE
  server.register([Inert, Sms, RestaurantSpecific, CheckIn, userSignup, userLogin], function(err){
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
              defaultExtension: 'html',
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
