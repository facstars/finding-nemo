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
    path: '/',
    handler: function (request, reply) {
      userRef.once("value", function(snapshot){
        var users = snapshot.val();
        var user_found = false;

        for(var uid in users) {
          var userData = users[uid];
          //if user exists return
          if(request.payload.tel == userData.tel ){
            user_found = true;
            var password_correct = bcrypt.compareSync(
              request.payload.password, userData.password
            );
            if (password_correct) {
              var token = tokenGenerator.createToken(
                {uid: uid, tel: userData.tel}
              );
              //http://hapijs.com/tutorials/cookies`
              return reply.redirect("/user/restList").state(
                'firebase_token', token, {encoding: 'none'}
              );
            }
            else {
              console.log("incorrect password");
              return reply.redirect("/user/userLogin.html?error=password");
              }
            }
        }

        if (!user_found) {
          console.log("incorrect user");
          return reply.redirect("/user/userLogin.html?error=password");
        }
      });
    }
  });


  server.route({
    method: 'GET',
    path: '/logout',
    handler: function (request, reply) {
        return reply('').state(
          'firebase_token', null, {encoding: 'none'}
        );
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'userLogin'
};
