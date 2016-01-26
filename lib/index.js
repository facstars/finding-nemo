var Hapi = require('hapi');
var Path = require('path');
var Inert = require('inert');
var RestaurantSpecific = require('./restSpecific.js');
var Sms = require('./sms.js');


exports.init = function(port,next){
  var server = new Hapi.Server({
  });

  server.connection({port: port});

  server.register([Inert, Sms, RestaurantSpecific], function(err){
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
