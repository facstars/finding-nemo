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
          console.log(userData);
          //if user exists return
          if(request.payload.tel == userData.tel ){
            if (request.payload.password == userData.password) {
              var token = tokenGenerator.createToken(
                {uid: uid, tel: userData.tel}
              );
              //http://hapijs.com/tutorials/cookies`
              return reply.redirect("/user/restList.html").state('firebase_token', token, {encoding: 'none'} );
            }
            else {
              console.log("incorrect pw");
              return reply.redirect("/user/userLogin.html?error=password");
              }
          }
        }
        //if reached this point, means we didn't find the user
        console.log("incorrect user");
        return reply.redirect("/user/userLogin.html?error=password");

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
