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
    var requestObj = JSON.parse(request.payload);
    var userExists = false;
    userRef.once("value", function(snapshot){
      //the forEach of firebase is synchronous
      if (requestObj.password !== requestObj.confirmPassword) {
        return reply.redirect("/?error=confirmPassword");
      }
      snapshot.forEach(function (user) {
        var userData = user.val();
        //if user exists return
        if(requestObj.tel == userData.tel){
          userExists = true;
          return true;
        }
      });
      (userExists) ? reply.redirect("/?error=userExists") : addNewUserToDb(requestObj, reply);
    });
  };

  function addNewUserToDb(request, reply){
    var userpassword = bcrypt.hash(request.password, 8, function(err, hash) {
      var uid = Uid(30);
      console.log("hi");

      var newUserData = {};
      newUserData[uid] = {
              name:request.name,
              tel: request.tel,
              password: hash,
              alreadyOnWaitlist: false,
              queueRuid: "",
              queueTableNo: "",
              queueTid: ""
            };

      userRef.update(newUserData);
      generateAndStoreUserJWT(newUserData, reply);
    });
  }

  function generateAndStoreUserJWT(newUserData, reply){
    var token;
    userRef.once("value", function(snapshot){
      console.log(Object.keys(newUserData)[0]);
      token = tokenGenerator.createToken(
        {uid: Object.keys(newUserData)[0], tel: newUserData.tel}
      );
      return reply("/user/restList").state('firebase_token', token, {encoding: 'none'}) ;
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
