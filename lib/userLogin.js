var Path = require('path');

var Firebase = require('firebase');
var userRef = new Firebase("https://blistering-torch-1660.firebaseio.com/users/");

var FirebaseTokenGenerator = require("firebase-token-generator");
var tokenGenerator = new FirebaseTokenGenerator(process.env.FIREBASE_SECRET);

exports.register = function(server,options,next) {

  server.route({
    method: 'POST',
    path: '/login',
    handler: function (request, reply) {
      console.log(request.payload);
      userRef.once("value", function(snapshot){
        var users = snapshot.val();
        for(var uid in users) {
          var userData = users[uid];
          //if user exists return
          if(request.payload.tel == userData.tel ){
            if (request.payload.password == userData.password) {
              var token = tokenGenerator.createToken(
                {uid: uid, tel: userData.tel}
              );
              //http://hapijs.com/tutorials/cookies`
              return reply("Logged in").state('firebase_token', token, {encoding: 'none'} );
            }
            else {
              return reply("incorrect password");
              }
          }
        }

      });
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'userLogin'
};
