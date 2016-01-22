exports.register = function(server,options,next) {

  server.route([
    {
      method:'GET',
      path:'/css/{param*}',
      config: {
        description: 'return files from public css folder',
        handler: {
          directory: {
            path: 'public/css',
            listing:true
          }
        }
      }
    }
  ]);

  return next();
};

exports.register.attributes = {
  name: 'publicCSS'
};
