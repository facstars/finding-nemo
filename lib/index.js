var Hapi = require('hapi');
var Inert = require('inert');

var Home = require('./home.js');
var Restaurant = require('./restaurant.js');
var NewRestaurant = require('./newRest.js');
var RestaurantOverview = require('./restOverview.js');
var RestaurantSpecific = require('./restSpecific.js');
var PublicCSS = require('./publicCSS.js');
var RestaurantJS = require('./restaurantJS.js');


exports.init = function(port,next){

  var server = new Hapi.Server();
  server.connection({port: port});
  server.register([Inert, Home, PublicCSS, RestaurantJS, Restaurant, NewRestaurant, RestaurantOverview, RestaurantSpecific], function(err){
    if (err) {
      return next(err);
    }

    server.start(function (err) {

      return next(err,server);
    });
  });
module.exports = server;
};
