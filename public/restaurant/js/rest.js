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
      var numOnWaitlist = snapshot.numChildren();
      document.getElementById("numPeopleWaitingTable"+tableNo).innerHTML= numOnWaitlist;
  }, errorHandler);
}

var errorHandler = function(errorObject) {
  console.log("The read failed: " + errorObject.code);
};

  document.getElementById('modalForm').addEventListener('submit', function(e){
    e.preventDefault();
    var tempUser = new Firebase ("https://blistering-torch-1660.firebaseio.com");
    var tempUserDetails = ["name", "tel", "guests"];
    var tempUserDetailsObj = tempUserDetails.reduce(function(obj, detail){
      obj[detail] = modalForm[detail].value;
      return obj;
    }, {});
    tempUser.authAnonymously(function(error, authData) {
      console.log(tempUserDetailsObj);
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData.uid);
        addTempUserToWaitlist(authData, tempUserDetailsObj);
      }
    });
  });

var addTempUserToWaitlist = function(authData, tempUserDetailsObj){
  var tempUid = authData.uid;
  var tableNo = tempUserDetailsObj.party > 4 ? "5" : tempUserDetailsObj.party > 2 ? "4" : "2";
  var restaurantWaitlist = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/table"+tableNo);
  var waitlistObj = {};
  waitlistObj[tempUid] = tempUserDetailsObj;

  console.log(waitlistObj);
  restaurantWaitlist.update(waitlistObj, function(error) {
    if (error) {
      console.log('Synchronization failed');
    } else {
      console.log('Synchronization succeeded');
      $('#modalForm')[0].reset();
      $('#modal').modal('hide');
    }
  });
};
