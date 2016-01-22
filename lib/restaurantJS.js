exports.register = function(server,options,next) {

  server.route([
    {
      method:'GET',
      path:'/restaurant/js/{param*}',
      config: {
        description: 'return files from restaurant js folder',
        handler: {
          directory: {
            path: 'public/restaurant/js',
            listing:true
          }
        }
      }
    }
  ]);

  return next();
};

exports.register.attributes = {
  name: 'RestaurantJS'
};
