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
  var restaurantWaitlist=new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/table"+tableNo);

// https://blistering-torch-1660.firebaseio.com/restaurants/77652e1c-dadc-409e-a66e-4b20ab3e9835/waitlist/table2
    restaurantWaitlist.on('value', function(snapshot) {
      var numTableObj=snapshot.val();
      console.log(numTableObj);
      document.getElementById("numPeopleWaitingTable"+tableNo).innerHTML=Object.keys(numTableObj).length;
  }, errorHandler);
}

var errorHandler = function(errorObject) {
  console.log("The read failed: " + errorObject.code);
};
