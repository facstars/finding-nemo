var env = require('env2')('config.env');

var messagebird = require('messagebird')(process.env.messageBirdTestAccessKey);

var params = {
  'originator': 'Skipit',
  'recipients': [
    '07817707982'
  ],
  'body': 'Hello! Your table is ready. Please head to the restaurant. Enjoy your meal! Skipit'
};

messagebird.messages.create(params, function (err, data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});
