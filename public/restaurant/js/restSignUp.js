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
  })
}

var setUserDetails = function(restUserId){
  var userDetails = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+restUserId);
  var RestDetailsArray = ["restName", "address", "description", "image", "openTime", "closeTime"];
  var newRestDetailsObj = RestDetailsArray.reduce(function(accum, elem){
    accum[elem] = newRest.elements[elem].value;
    return accum;
  }, {});

  userDetails.set(
    newRestDetailsObj
    ,onComplete);
};


var onComplete = function(error) {
  if (error) {
    console.log(error);
      } else {
          console.log('Success, Details have been added to the database');
      }
};
