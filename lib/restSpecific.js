var Path = require('path');

exports.register = function(server,options,next) {

  server.route([
    {
      method:'GET',
      path:'/restaurantSpecific/{param?}',
      config: {
        description: 'return restSpecific.html',
        handler: {
            file: Path.join(__dirname, '../public/restaurant/restSpecific.html')
          }
        }
      }
  ]);

  return next();
};

exports.register.attributes = {
  name: 'RestaurantSpecific'
};
