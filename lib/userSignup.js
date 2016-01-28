var Path = require('path');
var Firebase = require('firebase');
var userRef = new Firebase("https://blistering-torch-1660.firebaseio.com/users/");
var bcrypt = require('bcrypt');


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
          var userpassword = bcrypt.hash(request.payload.password, 8, function(err, hash) {
           userRef.push({
             name: request.payload.name,
             tel: request.payload.tel,
             password: hash
           });
          });
         return reply.redirect("/user/restList.html");
        }
      });
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'userSignup'
};
