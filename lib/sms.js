exports.register = function(server,options,next) {

var Path = require('path');
var env = require('env2')('./config.env');
var messagebird = require('messagebird')(process.env.messageBirdTestAccessKey);


  var smsHandler = function(request, reply){
    var tel = JSON.parse(request.payload).tel;
    console.log(tel);

    var params = {
      'originator': 'Skipit',
      'recipients': [
        tel
      ],
      'body': 'Hello! Your table is ready. Please head to the restaurant. Enjoy your meal! Much love, Skipit'
    };

    messagebird.messages.create(params, function (err, data) {
      if (err) {
        console.log(err);
        reply("SMS Not sent");

      } else{
        console.log(data);
        reply("SMS sent");
      }
    });
  };

  server.route([
    {
      method:'POST',
      path:'/sms',
      config: {
        description: 'sends sms via messageBird',
        handler: smsHandler
        }
      }
  ]);

  return next();
};

exports.register.attributes = {
  name: 'Sms'
};
