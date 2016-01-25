var ruid=localStorage.getItem("RUID");
var ref= new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid);

var loadRestDetails =(function(){
  ref.on('value', function(snapshot) {
    var restDetailsObj=snapshot.val();
    document.getElementById("restaurantName").innerHTML=restDetailsObj.restName;
  }, errorHandler);

  loadNumPeopleWaiting(2);
  loadNumPeopleWaiting(4);
  loadNumPeopleWaiting(5);

}) ();

function loadNumPeopleWaiting(tableNo){
  var restaurantWaitlist = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/table"+tableNo);
    restaurantWaitlist.on('value', function(snapshot) {
      var numTableObj=snapshot.val();
      console.log(numTableObj);
      document.getElementById("numPeopleWaitingTable"+tableNo).innerHTML=Object.keys(numTableObj).length;
  }, errorHandler);
}

var errorHandler = function(errorObject) {
  console.log("The read failed: " + errorObject.code);
};

  document.getElementById('modalForm').addEventListener('submit', function(e){
    var tempUser = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/");
    e.preventDefault();
    tempUser.authAnonymously(function(error, authData, modalForm) {
      console.log(modalForm);
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData.uid);
        // addTempUserToWaitlist(authData);
        // var tempUserDetails = ["name", "phone-number", "table-size"];
        // var tempUserDetailsObj = tempUserDetails.reduce(function(obj, detail){
        //   obj[detail] = modalForm[detail].value;
        //   return obj;
        // }, {});
        // addTempUserToWaitlist(authData, tempUserDetailsObj, ruid);
      }
    });
  });

var addTempUserToWaitlist = function(authData){
  console.log(authData.uid);
  // restaurantWaitlist.update();
};
