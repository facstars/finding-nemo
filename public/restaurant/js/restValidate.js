console.log('hey mate');


document.getElementById('newRest').addEventListener('submit', function(e){
  e.preventDefault();
  var array = ["email", "password", "restName", "address", "description", "image", "openTime", "closeTime"];
  var newRestInputObj = array.reduce(function(accum, elem){
    accum[elem] = newRest.elements[elem].value;
    return accum;
  }, {});

  var ref = new Firebase("https://blistering-torch-1660.firebaseio.com");
  ref.createUser(newRestInputObj, function(error, userData){
    if(error){
      console.log("error creating user", error);
    }
    else {
      console.log("Successfully created user account with uid:" + userData);
    }
  });
});
