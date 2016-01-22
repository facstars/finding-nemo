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
      console.log("Successfully created user account with uid:" + userData.uid);
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

  document.getElementById('go').addEventListener('submit', function(e){
    e.preventDefault();
    var ruid = go.elements[0].value;
    var specificRestaurant = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/" + ruid);
      specificRestaurant.remove(finished());
  });

  var finished = function(){
    console.log("I am the callback, restaurant deleted!");
  };
