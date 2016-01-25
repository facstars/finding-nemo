var Hapi = require('hapi');
var Path = require('path');
var Inert = require('inert');
var RestaurantSpecific = require('./restSpecific.js');

var Firebase = require('firebase');
var userRef = new Firebase("https://blistering-torch-1660.firebaseio.com/users/");

exports.init = function(port,next){
  var server = new Hapi.Server({
  });

  server.connection({port: port});

  server.register([Inert, RestaurantSpecific], function(err){
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

  server.route({
    method: 'POST',
    path: '/signup',
    handler: function (request, reply) {
      var userExists = false;
      userRef.on("value", function(snapshot){
        //the forEach of firebase is synchronous
        snapshot.forEach(function (user) {
          var userData = user.val();
          //if user exists return
          if(request.payload.tel == userData.tel){
            userExists = true;
            return true;
          }
        });
        //save user

        console.log(request.payload);
        if (userExists) {
          return reply("user already exists in the database");
        }
        reply("OK");
      });
    }


  });

  server.start(function (err) {
    console.log('Server running at:', server.info.uri);
    return next(err,server);
  });

module.exports = server;
};
