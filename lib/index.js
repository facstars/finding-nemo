var Hapi = require('hapi');
var Path = require('path');
var Inert = require('inert');
var RestaurantSpecific = require('./restSpecific.js');
var userSignup = require('./userSignup.js');
var userLogin = require('./userLogin.js');

var Firebase = require('firebase');
var userRef = new Firebase("https://blistering-torch-1660.firebaseio.com/users/");

exports.init = function(port,next){
  var server = new Hapi.Server({
  });

  server.connection({port: port});

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
