var Hapi = require('hapi');
var Inert = require('inert');

var Home = require('./home.js');
var Restaurant = require('./restaurant.js');
var NewRestaurant = require('./newRest.js');

exports.init = function(port,next){

  var server = new Hapi.Server();
  server.connection({port: port});
  server.register([Inert, Home, Restaurant, NewRestaurant], function(err){
    if (err) {
      return next(err);
    }

    server.start(function (err) {

      return next(err,server);
    });
  });
module.exports = server;
};
