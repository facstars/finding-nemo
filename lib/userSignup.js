var Path = require('path');
var env = require('env2')('config.env');


var Firebase = require('firebase');
var userRef = new Firebase("https://blistering-torch-1660.firebaseio.com/users/");

var FirebaseTokenGenerator = require("firebase-token-generator");
var tokenGenerator = new FirebaseTokenGenerator(process.env.FIREBASE_SECRET);

exports.register = function(server,options,next) {

  server.route({
    method: 'POST',
    path: '/signup',
    handler: function (request, reply) {
      var userExists = false;
      userRef.once("value", function(snapshot){
        //the forEach of firebase is synchronous
        snapshot.forEach(function (user) {
          var userData = user.val();
          //if user exists return
          if(request.payload.tel == userData.tel){
            userExists = true;
            return true;
          }
        });
        //save user
        console.log(request.payload);
        if (userExists) {
          return reply.redirect("/user/userLogin.html");
        }
        else {
        userRef.push({
          name: request.payload.name,
          tel: request.payload.tel,
          password: request.payload.password
        });

        userRef.on("value", function(snapshot){
          var userDetailsObj=snapshot.val();
          var uidsArray =Object.keys(userDetailsObj);
          var uidNew = uidsArray[uidsArray.length-1];
          var token = tokenGenerator.createToken(
            {uid: uidNew, tel: request.payload.tel}
          );
          return reply.redirect("/user/restList").state('firebase_token', token, {encoding: 'none'} ) ;
        });

        }
      });
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'userSignup'
};
