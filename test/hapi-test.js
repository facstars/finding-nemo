var test    = require('tape');
var path    = require('path');

var dir     = __dirname.split('/')[__dirname.split('/').length-1];
var file    = dir + __filename.replace(__dirname, '') + ' ->';

var start = require('../lib/start.js');
var server   = require('../lib/index.js');

var testEndPoint = function(endpoint, method, statusCode, payload){
  test(file + method + endpoint +" returns status 200", function(t) {
    var options = {
      method  : method,
      url     : endpoint,
      payload : payload
    };
    server.inject(options, function (res) {
      t.equal(res.statusCode, statusCode, 'server loads ok');
        server.stop(t.end);
    });
  });
};


//rest side tests
testEndPoint("/restaurantSpecific/table2", "GET", 200);
testEndPoint("/restaurant/restOverview", "GET", 200);
testEndPoint("/restaurant/newRest", "GET", 200);
testEndPoint("/logout", "GET", 200);
testEndPoint("/signup", "POST", 200, {tel: 07817707989, password: "tegrab"});


//user side tests
testEndPoint("/", "GET", 200);
testEndPoint("/user/userLogin", "GET", 200);
testEndPoint("/user/restList", "GET", 200);
testEndPoint("/user/checkIn", "GET", 200);
testEndPoint("/user/js/logout.js", "GET", 200);
testEndPoint("/logout", "GET", 200);
testEndPoint("/", "POST", 302,{
    name: "jbomb",
    tel: 07817707981,
    password: "tet",
    confirmPassword: "tet"
  });
testEndPoint("/", "POST", 302,{
    name: "jbomb",
    tel: 11111111111,
    password: "tegrab",
    confirmPassword: "tegrab"
  });
testEndPoint("/", "POST", 302, {tel: 07817707981, password: "tegrab"});
testEndPoint("/", "POST", 302, {tel: 07817707989, password: "tegrab"});


//other file
testEndPoint("/css/public.css", "GET", 200);
testEndPoint("/back.js", "GET", 200);
testEndPoint("/favicon.png", "GET", 200);


test(file + "POST returns 'SMS sent'", function(t){
  var payload = JSON.stringify({
    tel:"07111111111"
  });

  var options = {
    method: "POST",
    url: "/sms",
    payload: payload
  };

  server.inject(options, function(res){
    var index = res.payload.indexOf("SMS sent");
    t.ok(index >-1, "SMS sent successfully");
    server.stop(t.end);
  });
});

test.onFinish(function() {
  process.exit();
});
