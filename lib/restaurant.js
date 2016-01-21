exports.register = function(server,options,next) {

  server.route([
    {
      method:'GET',
      path:'/restaurant/{param*}',
      config: {
        description: 'return files from restaurant folder',
        handler: {
          directory: {
            path: 'public/restaurant',
            index: 'restLogin.html',
            listing:true
          }
        }
      }
    }
  ]);

  return next();
};

exports.register.attributes = {
  name: 'Restaurant'
};
