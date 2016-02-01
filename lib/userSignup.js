var Path = require('path');
var env = require('env2')('./config.env');
var Uid = require('uid');
var Firebase = require('firebase');
var userRef = new Firebase("https://blistering-torch-1660.firebaseio.com/users/");
var bcrypt = require('bcrypt');

var FirebaseTokenGenerator = require("firebase-token-generator");
var tokenGenerator = new FirebaseTokenGenerator(process.env.FIREBASE_SECRET);

exports.register = function(server,options,next) {

  var userSignupHandler = function (request, reply) {
    var userExists = false;
    userRef.once("value", function(snapshot){
      //the forEach of firebase is synchronous
      if (request.payload.password !== request.payload.confirmPassword) {
        return reply.redirect("/user/userLogin.html?error=confirmPassword");
      }
      snapshot.forEach(function (user) {
        var userData = user.val();
        //if user exists return
        if(request.payload.tel == userData.tel){
          userExists = true;
          return true;
        }
      });
      (userExists) ? reply.redirect("/user/userLogin.html") : addNewUserToDb(request, reply);
    });
  };

  function addNewUserToDb(request, reply){
    var userpassword = bcrypt.hash(request.payload.password, 8, function(err, hash) {
      var uid = Uid(30);

      var newUserData = {};
      newUserData[uid] = {
              name:request.payload.name,
              tel: request.payload.tel,
              password: hash,
              alreadyOnWaitlist: false
            };

      userRef.update(newUserData);
      generateAndStoreUserJWT(newUserData, reply);
    });
  }

  function generateAndStoreUserJWT(newUserData, reply){
    userRef.on("value", function(snapshot){
      var token = tokenGenerator.createToken(
        {uid: Object.keys(newUserData)[0], tel: newUserData.tel}
      );
      return reply.redirect("/user/restList").state('firebase_token', token, {encoding: 'none'} ) ;
    });
  }


  server.route({
    method: 'POST',
    path: '/signup',
    handler: userSignupHandler
  });

  return next();
};

exports.register.attributes = {
  name: 'userSignup'
};
