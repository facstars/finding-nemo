exports.register = function(server,options,next) {

  server.route([
    {
      method:'GET',
      path:'/restaurantOverview/{param*}',
      config: {
        description: 'return files for new restaurant',
        handler: {
          directory: {
            path: 'public/restaurant',
            index: 'restOverview.html',
            listing:true
          }
        }
      }
    }
  ]);

  return next();
};

exports.register.attributes = {
  name: 'RestaurantOverview'
};
