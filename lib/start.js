var Server = require('./index.js');
var Hoek = require('hoek');

Server.init(process.env.PORT || 8000, function (err,server) {
  Hoek.assert(!err,err);
  console.log('the server is running on ', server.info.uri);
});
