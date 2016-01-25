var ref = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants");

document.getElementById('newRest').addEventListener('submit', function(e){
  e.preventDefault();
  var AuthDetailsArray = ["email", "password"];
  var newRestAuthDetailsObj = AuthDetailsArray.reduce(function(accum, elem){
    accum[elem] = newRest.elements[elem].value;
    return accum;
  }, {});
  setUserAuth(newRestAuthDetailsObj);
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
          console.log('Success, Details have been added to the database');
      }
};

var allRestaurants = (function(){
  ref.on("value", function(snapshot) {
    printRestaurantNames(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}) ();

var printRestaurantNames = function(restaurantObj){
  var html = (Object.keys(restaurantObj)).reduce(function(html, elem){
    return html + "<option value=" + elem + ">" + restaurantObj[elem].restName + "</option>";
  }, "");
    document.getElementById('options').innerHTML = html;
  };

  document.getElementById('removeRestaurantModalForm').addEventListener('submit', function(e){
    console.log('remove clicked');
    e.preventDefault();
    var credentials = {
      remove : {
        email: removeRestaurantModalForm.email.value,
        password: removeRestaurantModalForm.password.value
      },
      ruid: removeRestaurantModalForm.options.value
    };
    console.log(credentials);
    var specificRestaurant = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/" + credentials.ruid);
      specificRestaurant.remove(removeUser(credentials));
  });

  var removeUser = function (credentials){
    console.log("i am the credentials", credentials);
    var ref = new Firebase("https://blistering-torch-1660.firebaseio.com");
    ref.removeUser(credentials.remove, function(error) {
      console.log("im deleting");
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
      }
    });
  };
