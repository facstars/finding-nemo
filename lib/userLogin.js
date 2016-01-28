var Path = require('path');
var env = require('env2')('./config.env');
var Firebase = require('firebase');
var userRef = new Firebase("https://blistering-torch-1660.firebaseio.com/users/");
var FirebaseTokenGenerator = require("firebase-token-generator");
var tokenGenerator = new FirebaseTokenGenerator(process.env.FIREBASE_SECRET);
var bcrypt = require('bcrypt');

exports.register = function(server,options,next) {

  server.route({
    method: 'POST',
    path: '/login',
    handler: function (request, reply) {
      userRef.once("value", function(snapshot){
        var users = snapshot.val();
        var pw_correct = false;
        for(var uid in users) {
          var userData = users[uid];
          //if user exists return
          if(request.payload.tel == userData.tel ){
            bcrypt.compare(request.payload.password, userData.password, function(err, res){
              pw_correct = res;
              if (pw_correct) {
                var token = tokenGenerator.createToken(
                  {uid: uid, tel: userData.tel}
                );
                //http://hapijs.com/tutorials/cookies`
                return reply.redirect("/user/restList").state('firebase_token', token, {encoding: 'none'} );
            }
            else {
              console.log("incorrect login");
              return reply.redirect("/user/userLogin.html?error=password");
              }
            });
          }
        }
      });
    }
  });


  server.route({
    method: 'GET',
    path: '/logout',
    handler: function (request, reply) {
        return reply.redirect("/user/userLogin.html").state('firebase_token', null, {encoding: 'none'});
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'userLogin'
};
