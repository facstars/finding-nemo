exports.register = function(server,options,next) {

var Path = require('path');
var env = require('env2')('./config.env');
var messagebird = require('messagebird')(process.env.messageBirdAccessKey || process.env.messageBirdAccessKey);


  var smsHandler = function(request, reply){
    var tel = request.payload.tel;
    var params;
    if (request.payload.type === "Table ready"){
      params = {
        'originator': 'Wahaca',
        'recipients': [
          request.payload.tel
        ],
        'body': 'Hello! Your table will be ready shortly. Please head to the restaurant. Enjoy your meal. Cheers, Wahaca!'
      };
    }
    else{
      params = {
        'originator': 'Wahaca',
        'recipients': [
          request.payload.tel
        ],
        'body': 'Hello! We are really sorry but the restaurant had to cancel your booking. Feel free to checkout other amazing restaurants near you. Wahaca!'
      };
    }

    messagebird.messages.create(params, function (err, data) {
      if (err) {
        console.log(err);
        reply("SMS Not sent");

      } else{
        console.log(data);
        reply(request.payload.type + " SMS sent");
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
