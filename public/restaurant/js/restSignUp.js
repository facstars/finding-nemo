var ref = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants");

document.getElementById('newRest').addEventListener('submit', function(e){
  e.preventDefault();
  if(newRest.password.value == newRest.passwordConfirm.value){
    var AuthDetailsArray = ["email", "password"];
    var newRestAuthDetailsObj = AuthDetailsArray.reduce(function(accum, elem){
      accum[elem] = newRest.elements[elem].value;
      return accum;
    }, {});
    document.getElementById('passwordIncorrect').style.display = "none";
    setUserAuth(newRestAuthDetailsObj);
  } else {
    document.getElementById('passwordIncorrect').style.display = "block";
  }
});


var setUserAuth = function (obj){
  ref.createUser(obj, function(error, userData){
    if(error){
      console.log("error creating user", error);
    }
    else {
      console.log("Successfully created restaurant account with ruid:" + userData.uid);
      setUserDetails(userData.uid);
    }
  });
};

var setUserDetails = function(restUserId){
  var userDetails = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+restUserId);
  var RestDetailsArray = ["restName", "address", "description", "image", "openTime", "closeTime"];
  var newRestDetailsObj = RestDetailsArray.reduce(function(accum, elem){
    accum[elem] = newRest.elements[elem].value;
    return accum;
  }, {});

  userDetails.set(
    newRestDetailsObj, onComplete);
};


var onComplete = function(error) {
  if (error) {
    console.log(error);
      } else {
        alert("The restaurant has been successfully added");
        $('#newRest')[0].reset();
        console.log('Success, Details have been added to the database');
      }
};

  document.getElementById('removeRestaurantModalForm').addEventListener('submit', function(e){
    e.preventDefault();
    validateRestLoginDetails();
  });

var validateRestLoginDetails = function(email,pw){
  var inputEmail=removeRestaurantModalForm.email.value;
  var inputPw=removeRestaurantModalForm.password.value;
  ref.authWithPassword({
    email: inputEmail,
    password: inputPw
  }, function(error, authData) {
    if (error) {
      $("#incorrect-p")[0].innerHTML = "Incorrect restaurant login details";
    } else {
      console.log("Correct restaurant login details");
          var credentials = {
            remove : {
              email: inputEmail,
              password: inputPw
            },
            ruid: authData.uid
          };
          var specificRestaurant = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/" + credentials.ruid);
          specificRestaurant.remove(removeUser(credentials));
    }
  });
};

  var removeUser = function (credentials){
    var ref = new Firebase("https://blistering-torch-1660.firebaseio.com");
    ref.removeUser(credentials.remove, function(error) {
      if (error) {
        switch (error.code) {
          case "INVALID_USER":
          console.log("The specified user account does not exist.");
          break;
          case "INVALID_PASSWORD":
          console.log("The specified user account password is incorrect.");
          break;
          default:
          console.log("Error removing user:", error);
        }
      } else {
        console.log("User account deleted successfully!");
        $('#removeRestaurantModalForm')[0].reset();
        $('#removeModal').modal('hide');
        removeQueueDetails(credentials.ruid);
      }
    });
  };


  function removeQueueDetails(ruid){
    var Users = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/");
    Users.once("value", function(snapshot){
      var userDetailsObj=snapshot.val();
      var UserQueueDetailsObj=Object.keys(userDetailsObj).reduce(function(obj, uid){
        if(userDetailsObj[uid].queueRuid==ruid){
            changeQueueDetails(uid);
        }
      },{});
    });
  }

  function changeQueueDetails(uid){
      var User = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/"+uid);
      User.update({
        alreadyOnWaitlist: false,
        queueRuid: "" ,
        queueTableNo: "",
        queueTid: ""
      });
    }


  var errorHandler = function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  };
