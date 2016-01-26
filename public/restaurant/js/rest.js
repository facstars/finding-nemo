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
