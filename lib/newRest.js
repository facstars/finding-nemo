exports.register = function(server,options,next) {

  server.route([
    {
      method:'GET',
      path:'/newRestaurant/{param*}',
      config: {
        description: 'return files for new restaurant',
        handler: {
          directory: {
            path: 'public/restaurant',
            index: 'newRest.html',
            listing:true
          }
        }
      }
    }
  ]);

  return next();
};

exports.register.attributes = {
  name: 'NewRestaurant'
};
