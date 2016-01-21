exports.register = function(server,options,next) {

  server.route([
    {
      method:'GET',
      path:'/{param*}',
      config: {
        description: 'return files from public folder',
        handler: {
          directory: {
            path: 'public',
            listing:true
          }
        }
      }
    }
  ]);

  return next();
};

exports.register.attributes = {
  name: 'Home'
};
