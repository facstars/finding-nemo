var Path = require('path');

exports.register = function(server,options,next) {

  server.route(
    {
      method:'GET',
      path:'/favicon.png',
      config: {
        description: 'return favicon from root',
        handler: function(request, reply) {
            reply.file('favicon.png');
          }
        }
      }
  );

  return next();
};

exports.register.attributes = {
  name: 'favicon'
};
