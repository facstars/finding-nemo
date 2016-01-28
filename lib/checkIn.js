var Path = require('path');

exports.register = function(server,options,next) {

  server.route([
    {
      method:'GET',
      path:'/checkIn/{param?}',
      config: {
        description: 'return checkIn.html',
        handler: {
            file: Path.join(__dirname, '../public/user/checkIn.html')
          }
        }
      }
  ]);

  return next();
};

exports.register.attributes = {
  name: 'CheckIn'
};
