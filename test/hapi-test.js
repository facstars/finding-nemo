var test    = require('tape');
var path    = require('path');

var dir     = __dirname.split('/')[__dirname.split('/').length-1];
var file    = dir + __filename.replace(__dirname, '') + ' ->';

var start = require('../lib/start.js');
var server   = require('../lib/index.js');

var testEndPoint = function(endpoint){
  test(file + " GET "+ endpoint +" returns status 200", function(t) {
    var options = {
      method  : "GET",
      url     : endpoint
    };
    server.inject(options, function (res) {
      t.equal(res.statusCode, 200, 'server loads ok');
        server.stop(t.end);
    });
  });
    test.onFinish(function() {
        process.exit();
    });
};



testEndPoint("/");
testEndPoint("/restaurantSpecific/table2");
testEndPoint("/restaurant/restOverview.html");
testEndPoint("/user/restList");
testEndPoint("/css/public.css");
testEndPoint("/user/userLogin");
