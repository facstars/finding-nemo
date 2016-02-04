exports.register = function(server,options,next) {

var Path = require('path');
var env = require('env2')('./config.env');
var messagebird = require('messagebird')(process.env.messageBirdAccessKey);


  var smsCancelHandler = function(request, reply){
  //  var hello = request.payload;
    console.log("this is in the back end", request.payload);
  var tel = JSON.parse(request.payload).tel;
    console.log(tel);

    var params = {
      'originator': 'Skipit',
      'recipients': [
        tel
      ],
      'body': 'Hello! We are really sorry but the restaurant had to cancel your booking. Much love, Skipit'
    };

    messagebird.messages.create(params, function (err, data) {
      if (err) {
        console.log(err);
        reply("cannot seat SMS Not sent");

      } else{
        console.log(data);
        reply("Cannot seat SMS sent");
      }
    });
  };

  server.route([
    {
      method:'POST',
      path:'/smsCancel',
      config: {
        description: 'sends sms to cancel via messageBird',
        handler: smsCancelHandler
        }
      }
  ]);

  return next();
};

exports.register.attributes = {
  name: 'SmsCancel'
};
